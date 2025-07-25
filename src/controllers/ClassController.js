const Class = require("../models/Class")
const School = require("../models/School")
const Student = require("../models/Student")
const Employee = require("../models/Employee");
const AddTeacher = require("../models/AddTeacher");
const modelClass = require("../models/Class");
const Matter = require("../models/Matter");

class ClassController {

    async create(req, res) {
        const { year, serie, level, shift, classroom_number } = req.body;

        const { id } = req.params;

        // validations
        if (!year) {
            return res.status(422).json({ msg: "O Ano é obrigatório!" });
        }

        if (!serie) {
            return res.status(422).json({ msg: "A serie da turma é obrigatório!" });
        }

        if (!level) {
            return res.status(422).json({ msg: "O nivel da turma é obrigatório!" });
        }

        if (!shift) {
            return res.status(422).json({ msg: "o turno é obrigatória!" });
        }

        if (!id) {
            return res
                .status(422)
                .json({ msg: "Id da escola e obrigatorio!" });
        }

        // check if class exists
        const school = await School.findOne({ _id: id });

        const clss = await modelClass.find({ _id: school.id_class });

        if (clss) {

            const Res = clss.map(result => {
                if (result.serie == serie.toUpperCase()) {
                    return result.year
                }
            })

            if (Res) {
                const fil = Res.filter((fill) => {
                    if (fill == year) {
                        return fill
                    }
                })
                console.log("filter", fil)
                if (fil.length > 0) {
                    return res.status(422).json({ msg: "Essa truma ja esta cadastrada!" });
                }
            }

        }
        // Função para gerar o código da turma (ex: 20254821)
        const gerarClassCode = (ano) => {
            const aleatorio = Math.floor(1000 + Math.random() * 9000); // Gera 4 dígitos
            return `${ano}${aleatorio}`;
        };
        
        // create user
        const classCode = gerarClassCode(year);

        const newclass = new Class({
            year: year,
            serie: serie.toUpperCase(),
            level: level.toUpperCase(),
            shift: shift.toUpperCase(),
            classroom_number: classroom_number,
            id_school: id,
            classCode: classCode
        });


        try {

            const newClass = await newclass.save()

            await School.updateOne({
                _id: id
            }, {
                $push: {
                    id_class: newClass._id
                }
            })
            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async index(req, res) {

        const { idSchool } = req.body;

        try {
            const clss = await School.findById({
                _id: idSchool
            }).populate('id_class')

            if (clss) {
                return res.json({
                    data: clss.id_class,
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
            const clss = await Class.findById({
                _id: id
            }).populate('id_student').populate('id_employee')
                .populate('id_matter').populate('classRegentTeacher')
                .populate('classRegentTeacher02').populate('physicalEducationTeacher')
                .populate('transferStudents')
            if (clss) {
                return res.json({
                    data: [clss],
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

    async addStudent(req, res) {
        const { id_student, id_class } = req.body;
        // validations
        if (!id_student) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }

        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const student = await Student.find({ _id: id_student });
        //console.log("filter", student)
        if (student) {
            const stdt = student.map(clss => {
                return clss.id_class
            })

            const filter = stdt.find(fill => {
                return fill
            })
            console.log("filter", filter)

            if (filter.length > 0) {
                console.log("filter01", filter)
                const cla = await modelClass.find({ _id: filter });

                //const date = new Date();
                const currentYear = new Date().getFullYear();

                const result = cla.map(clss => {
                    return clss.year
                })

                if (currentYear == result) {
                    //console.log("currentYear", currentYear)
                    //console.log("filter", result)
                    return res.status(422).json({ result, msg: "Esse aluno ja esta cadastrado em uma turma!" });
                }
            }
            console.log("filter02", filter)

        }
        //console.log(filter)
        try {

            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_class: id_class
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    id_student: id_student
                }
            })
            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async removeStudent(req, res) {
        const { id_student, id_class } = req.body;
        // validations
        if (!id_student) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }

        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const student = await Student.find({ _id: id_student });
        if (!student) {
            return res.status(422).json({ msg: "O estudante não existe!" });
        }
        try {

            await Student.updateOne({
                _id: id_student
            }, {
                $pull: {
                    id_class: id_class
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    id_student: id_student
                }
            })
            res.status(200).json({
                msg: 'Estudante removido com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async removeTeacher(req, res) {
        const { id_teacher, id_class, /*id_matter, addTeacher*/ } = req.body;
        // validations
        if (!id_teacher) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }
        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        try {

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    id_employee: id_teacher
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    classRegentTeacher: id_teacher
                }
            })

            await Employee.updateOne({
                _id: id_teacher
            }, {
                $pull: {
                    id_class: id_class
                }
            })
            console.log('emp', id_teacher)
            console.log('class', id_class)
            res.status(200).json({
                msg: 'Estudante removido com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }
    async removeTeacher02(req, res) {
        const { id_teacher, id_class, /*id_matter, addTeacher*/ } = req.body;
        // validations
        if (!id_teacher) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }
        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        try {

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    id_employee: id_teacher
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    classRegentTeacher02: id_teacher
                }
            })

            await Employee.updateOne({
                _id: id_teacher
            }, {
                $pull: {
                    id_class: id_class
                }
            })
            console.log('emp', id_teacher)
            console.log('class', id_class)
            res.status(200).json({
                msg: 'Estudante removido com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async addTeacher(req, res) {
        const { id_employee, id_class, /*id_matter*/ } = req.body;

        // validations
        if (!id_employee) {
            return res.status(422).json({ msg: "O id do prefessor é obrigatório!" });
        }

        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        /*if (!id_matter) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }*/

        // Check if the student is already registered in a class
        const clss = await Class.find({ _id: id_class });
        const currentYear = new Date().getFullYear()
        if (clss) {
            const cl = clss.map(result => {
                return result.year
            })
            if (cl != currentYear) {
                return res.status(422).json({ msg: "Essa turma não e atual!" });
            }
            console.log("cl", cl)
            console.log("currentYear", currentYear)
            const teacher = clss.find(tchr => {
                return tchr
            }).id_employee.filter(res => {
                return res == id_employee
            })

            if (teacher.length > 0) {
                console.log("filter", teacher)
                return res.status(422).json({ msg: "Esse Professor ja esta cadastrado nessa turma!" });
            }

            console.log('teacher', teacher)
        }

        try {

            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_class: id_class
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    id_employee: id_employee,
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    classRegentTeacher: id_employee,
                }
            })

            /* await Matter.updateOne({
                 _id: id_matter
             }, {
                 $push: {
                     id_class: id_class      
                 }
             })
 
             await Class.updateOne({
                 _id: id_class
             }, {
                 $push: {
                     id_matter: id_matter      
                 }
             })*/

            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async addTeacher02(req, res) {
        const { id_employee, id_class, /*id_matter*/ } = req.body;

        // validations
        if (!id_employee) {
            return res.status(422).json({ msg: "O id do prefessor é obrigatório!" });
        }

        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const clss = await Class.find({ _id: id_class });
        const currentYear = new Date().getFullYear()
        if (clss) {
            const cl = clss.map(result => {
                return result.year
            })
            if (cl != currentYear) {
                return res.status(422).json({ msg: "Essa turma não e atual!" });
            }
            console.log("cl", cl)
            console.log("currentYear", currentYear)
            const teacher = clss.find(tchr => {
                return tchr
            }).id_employee.filter(res => {
                return res == id_employee
            })

            if (teacher.length > 0) {
                console.log("filter", teacher)
                return res.status(422).json({ msg: "Esse Professor ja esta cadastrado nessa turma!" });
            }

            console.log('teacher', teacher)
        }

        try {

            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_class: id_class
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    id_employee: id_employee,
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    classRegentTeacher02: id_employee,
                }
            })

            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async addPhysicalTeacher(req, res) {
        const { id_employee, id_class, } = req.body;

        // validations
        if (!id_employee) {
            return res.status(422).json({ msg: "O id do prefessor é obrigatório!" });
        }

        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        /*if (!id_matter) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }*/

        // Check if the student is already registered in a class
        const clss = await Class.find({ _id: id_class });
        const currentYear = new Date().getFullYear()
        if (clss) {
            const cl = clss.map(result => {
                return result.year
            })
            if (cl != currentYear) {
                return res.status(422).json({ msg: "Essa turma não e atual!" });
            }
            console.log("cl", cl)
            console.log("currentYear", currentYear)
            const teacher = clss.find(tchr => {
                return tchr
            }).id_employee.filter(res => {
                return res == id_employee
            })

            if (teacher.length > 0) {
                console.log("filter", teacher)
                return res.status(422).json({ msg: "Esse Professor ja esta cadastrado nessa turma!" });
            }

            console.log('teacher', teacher)
        }

        try {

            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_class: id_class
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    id_employee: id_employee,
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $push: {
                    physicalEducationTeacher: id_employee,
                }
            })

            /* await Matter.updateOne({
                 _id: id_matter
             }, {
                 $push: {
                     id_class: id_class      
                 }
             })
 
             await Class.updateOne({
                 _id: id_class
             }, {
                 $push: {
                     id_matter: id_matter      
                 }
             })*/

            res.status(200).json({
                msg: 'Turma cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async removePhysicalTeacher(req, res) {
        const { id_teacher, id_class, /*id_matter, addTeacher*/ } = req.body;
        // validations
        if (!id_teacher) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }
        if (!id_class) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        try {

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    id_employee: id_teacher
                }
            })

            await modelClass.updateOne({
                _id: id_class
            }, {
                $pull: {
                    physicalEducationTeacher: id_teacher
                }
            })

            await Employee.updateOne({
                _id: id_teacher
            }, {
                $pull: {
                    id_class: id_class
                }
            })
            console.log('emp', id_teacher)
            console.log('class', id_class)
            res.status(200).json({
                msg: 'Estudante removido com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async getclassById(req, res) {
        try {
            const cla$$ = await Class.findById(req.params.id);
            if (!cla$$) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(cla$$);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateClass(req, res) {
        try {
            const { id } = req.params;
            const cla$$ = await Class.findByIdAndUpdate(id, req.body, { new: true });
            if (!cla$$) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(cla$$);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;
            const cla$$ = await Class.findById(id);

            if (!cla$$) {
                return res.status(404).json();
            }

            await cla$$.deleteOne();

            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async returnedStudent(req, res) {
        try {
            const { id_student, id_class } = req.body;
            console.log('res', req.body)
            try {// Encontra a turma pelo ID
                const classData = await modelClass.findById(id_class);
                if (!classData) {
                    return res.status(404).json({ error: "Turma não encontrada" });
                }

                // Verifica se o aluno está na lista de transferidos
                if (!classData.transferStudents.includes(id_student)) {
                    return res.status(400).json({ error: "Aluno não está na lista de transferidos" });
                }

                // Remove o aluno do array de transferidos
                await modelClass.updateOne({
                    _id: id_class
                }, {
                    $pull: {
                        transferStudents: id_student
                    }
                })

                // Adiciona o aluno de volta à lista de alunos ativos
                await modelClass.updateOne({
                    _id: id_class
                }, {
                    $push: {
                        id_student: id_student
                    }
                })

                await Student.updateOne({
                    _id: id_student
                }, {
                    $push: {
                        id_class: id_class
                    }
                })

                // Salva as alterações no banco de dados
                return res.status(200).json({ success: true, message: "Aluno retornado com sucesso" });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async ReassignStudent(req, res) {
        try {
            const { id_student, oldClass, newClass } = req.body;
            console.log('res', req.body)
            try {// Encontra a turma pelo ID
                const classData = await modelClass.findById(newClass);
                if (!classData) {
                    return res.status(404).json({ error: "Turma não encontrada" });
                }

                const student = await Student.findById(id_student);
                if (!student) {
                    return res.status(404).json({ message: "Aluno não encontrado" });
                }

                // Remove o aluno do array de alunos
                await modelClass.updateOne({
                    _id: oldClass
                }, {
                    $pull: {
                        id_student: id_student
                    }
                })

                await modelClass.updateOne(
                    { _id: oldClass },
                    { $push: { transferStudents: id_student } }
                );

                await Student.updateOne({
                    _id: id_student
                }, {
                    $pull: {
                        id_class: oldClass
                    }
                })

                await modelClass.updateOne({
                    _id: newClass
                }, {
                    $push: {
                        id_student: id_student
                    }
                })

                await Student.updateOne({
                    _id: id_student
                }, {
                    $push: {
                        id_class: newClass
                    }
                })

                // Salva as alterações no banco de dados
                return res.status(200).json({ success: true, message: "Aluno remanejado com sucesso" });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new ClassController();