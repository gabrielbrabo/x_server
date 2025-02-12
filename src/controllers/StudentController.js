const School = require("../models/School")
const Student = require("../models/Student")
const Attendance = require("../models/Attendance")
const bcrypt = require('bcryptjs')

class StudentController {

    async create(req, res) {
        const {
            name,
            dateOfBirth,
            fatherCellPhone,
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
        /*if (!admissionDate) {
            return res.status(422).json({ msg: "A data de admissão e obrigatório!" });
        }*/

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        if (password != confirmpassword) {
            return res
                .status(422)
                .json({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        // check if user exists
        //const userExists = await Student.findOne({ cpf: cpf });

       /* if (userExists) {
            return res.status(422).json({ msg: "Esse estudante ja esta cadastrado!" });
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);*/

        // create user
        const user = new Student({
            name: name.toUpperCase(),
            dateOfBirth: dateOfBirth,
            fatherCellPhone: fatherCellPhone,
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
            }).populate('id_student')

            if (student) {
                return res.json({
                    data: student.id_student,
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

        const { month, year, id_student, id_matter, id_teacher } = req.body;

        const attendance = await Attendance.find({
            id_student: id_student,
            id_teacher: id_teacher
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