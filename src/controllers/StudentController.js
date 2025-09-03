const School = require("../models/School")
const Student = require("../models/Student")
const Attendance = require("../models/Attendance")
const Class = require("../models/Class")
const bcrypt = require('bcryptjs')

class StudentController {

    async create(req, res) {
        const {
            name,
            dateOfBirth,
            sex,
            race,
            cpf,
            rg,
            Registration,
            fatherCellPhone,
            entryDate,
            admissionDate,
            motherName,
            fatherName,
            motherCellPhone,
            address,
            registerStudent,
            password,
            confirmpassword
        } = req.body;

        const { id } = req.params;
        console.log("dados do front", req.body)

        // validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

        /*if (!rg) {
            return res.status(422).json({ msg: "O RG é obrigatório!" });
        }
        if (!cpf) {
            return res.status(422).json({ msg: "O cpf é obrigatório!" });
        }*/

        if (!dateOfBirth) {
            return res.status(422).json({ msg: "A data de nascimento é obrigatório!" });
        }
        if (!motherName) {
            return res.status(422).json({ msg: "Nome a mãe é obrigatório!" });
        }
        if (!motherCellPhone) {
            return res.status(422).json({ msg: "celular da mãe é obrigatório!" });
        }

        if (!registerStudent) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!address) {
            return res.status(422).json({ msg: "O endereço e obrigatório!" });
        }
        if (!sex) {
            return res.status(422).json({ msg: "O sexo do aluno e obrigatório!" });
        }
        if (!race) {
            return res.status(422).json({ msg: "A raça e obrigatório!" });
        }
        if (!entryDate) {
            return res.status(422).json({ msg: "A data de ingresso e obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        if (password != confirmpassword) {
            return res
                .status(422)
                .json({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        // check if user exists
        const userExists = await Student.findOne({
            id_school: id,
            $or: [
                { name: name.toUpperCase() },
                { cpf: cpf }
            ]
        });
        console.log("userExists", userExists)

        if (userExists) {
            return res.status(422).json({ msg: "Esse estudante ja esta cadastrado!" });
        }

        // create user
        const user = new Student({
            name: name.toUpperCase(),
            dateOfBirth: dateOfBirth,
            sex: sex,
            race: race,
            cpf: cpf,
            rg: rg,
            Registration: Registration,
            fatherCellPhone: fatherCellPhone,
            entryDate: entryDate,
            admissionDate: admissionDate,
            motherName: motherName,
            fatherName: fatherName,
            motherCellPhone: motherCellPhone,
            address: address,
            //type: "student",
            registerStudent: registerStudent,
            id_school: id,
            //password: passwordHash
        });

        try {

            const student = await user.save()

            await School.updateOne({
                _id: id
            }, {
                $push: {
                    id_student: student._id
                }
            })
            res.status(200).json({
                msg: 'Conta profissional cadastrado com sucesso.'
            })

        } catch (err) {
            console.error("Erro ao salvar aluno:", err);
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async index(req, res) {

        const { idSchool } = req.body;

        try {
            const student = await School.findById({
                _id: idSchool
            }).populate('id_student').populate('id_class')

            if (student) {
                return res.json({
                    data: student,
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async InfoIndex(req, res) {

        const { id } = req.params;

        try {
            const student = await Student.findById({
                _id: id
            }).populate('id_class')

            if (student) {
                return res.json({
                    data: [student],
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async AttendanceIndex(req, res) {

        const { month, year, id_student, id_matter, /*id_teacher*/ } = req.body;

        const attendance = await Attendance.find({
            id_student: id_student,
            //id_teacher: id_teacher
        });

        try {
            if (attendance) {
                const attdc = attendance.map(res => {
                    if (res.year == year) {
                        if (res.month == month) {
                            if (res.id_matter == id_matter) {
                                return res
                            }
                        }
                    }
                }).filter(res => {
                    if (res != null) {
                        return res
                    }
                })
                return res.json({
                    data: attdc,
                    message: 'Sucess'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async getStudentById(req, res) {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(student);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateStudent(req, res) {
        try {
            const { id } = req.params;
            const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
            if (!student) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(student);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async update(req, res) {
        try {
            const { id } = req.params;
            const { email, password } = req.body;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json();
            }

            const encryptedPassword = await createPasswordHash(password)

            await user.updateOne({ email, password: encryptedPassword });

            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateStatus(req, res) {
        const { id_student, status, exitDate } = req.body;
        const validStatuses = ["ativo", "transferido", "inativo"];

        console.log("id_student", id_student, "status", status, "exitDate", exitDate)

        // Verifica se o status enviado é válido
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Status inválido" });
        }

        const student = await Student.findById(id_student);
        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Obtém o ID da turma do aluno
        const studentClassId = student.id_class;
        console.log("ID da Turma:", studentClassId);

        try {

            // Define a data de saída se o aluno for transferido ou inativado
            // const exitDate = (status === "transferido" || status === "inativo") ? new Date() : null;

            if (status === "ativo") {
                await Student.updateOne(
                    { _id: id_student },
                    {
                        $set: {
                            status: status,
                            departureDate: null
                        }
                    }
                );
            }

            if (status === "transferido" || status === "inativo") {
                // Atualiza o status do aluno
                await Student.updateOne(
                    { _id: id_student },
                    {
                        $set: {
                            status: status,
                            departureDate: exitDate
                        },
                        ...(status === "transferido" && { $pull: { id_class: { $in: studentClassId } } }) // Remove turma apenas se não estiver ativando
                    }
                );
            }

            // Se for transferido, adiciona o aluno à lista de transferências
            if (status === "transferido") {

                await Class.updateOne(
                    { _id: studentClassId },
                    { $pull: { id_student: id_student } }
                );

                await Class.updateOne(
                    { _id: studentClassId },
                    { $push: { transferStudents: id_student } }
                );
            }

            res.json({ message: "Status atualizado com sucesso!", /*student*/ });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar status", error });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;
            const user = await Student.findById(id);

            if (!user) {
                return res.status(404).json();
            }

            await user.deleteOne();

            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new StudentController();
