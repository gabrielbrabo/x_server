const Grade = require("../models/Grade")
const Activities = require("../models/Activities")
const NumericalGrade = require("../models/NumericalGrade")
const Student = require("../models/Student")

class GradeController {

    async createActivity(req, res) {
        const { year, bimonthly, descricao, tipo, valor, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_vThQuarter, id_viThQuarter, id_teacher, id_teacher02, id_matter, id_class } = req.body;
        console.log("queisição", req.body)
        // validations
        if (!year) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!valor) {
            return res.status(422).json({ msg: "O valor é obrigatório!" });
        }

        const user = new Activities({
            year: year,
            bimonthly: bimonthly,
            descricao: descricao,
            tipo: tipo,
            valor: valor,
            id_teacher02,
            id_teacher: id_teacher,
            id_matter: id_matter,
            id_class: id_class,
            id_iStQuarter: id_iStQuarter,
            id_iiNdQuarter: id_iiNdQuarter,
            id_iiiRdQuarter: id_iiiRdQuarter,
            id_ivThQuarter: id_ivThQuarter,
            id_vThQuarter: id_vThQuarter,
            id_viThQuarter: id_viThQuarter,
        });

        try {

            const activity = await user.save()

            /*await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_grade: grade._id
                }
            })*/
            res.status(200).json({
                msg: 'Conta profissional cadastrado com sucesso.',
                activity: activity._id
            })

        } catch (err) {
            console.error("Erro ao cadastrar atividade:", err); // Mostra erro detalhado no terminal
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async GetActivity(req, res) {

        const { year, bimonthly, id_matter, id_class } = req.body;

        const grade = await Activities.find({
            id_class: id_class,
            id_matter: id_matter
        }).populate('id_matter').populate('id_teacher').populate('id_teacher02').populate('id_class').populate('id_iStQuarter').populate('id_iiNdQuarter').populate('id_iiiRdQuarter').populate('id_ivThQuarter').populate('id_vThQuarter').populate('id_viThQuarter')

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.bimonthly == bimonthly) {
                    return res
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", grade)
        console.log("grd", grd)
        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async updateAvaliação(req, res) {

        const {
            UpdateIdActivity,
            EditedDescription,
            EditedTipo,
            EditedValor
        } = req.body;

        const activities = await Activities.findByIdAndUpdate(
            UpdateIdActivity,
            {
                descricao: EditedDescription,
                tipo: EditedTipo,
                valor: EditedValor
            },
            { new: true }
        );

        try {
            if (!activities) {
                return res.status(404).json({ message: 'Student Grade not found' });
            }
            res.json(activities);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async DestroyActivity(req, res) {
        const { idActivity } = req.body;
        console.log("req.body", req.body)
        // validations
        if (!idActivity) {
            return res.status(422).json({ msg: "O id da aula é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const activities = await Activities.findOne({
            _id: idActivity
        })//.populate('id_teacher')
        /*const Grades = await NumericalGrade.findOne({
            idActivity: idActivity
        })*///.populate('id_teacher')


        try {

            await activities.deleteOne()
            await NumericalGrade.deleteMany({ idActivity: idActivity });
            res.status(200).json({
                msg: 'Avaliação removida com sucesso.'
            })
        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async GetGradeActivity(req, res) {
        const { id_activity } = req.body;  // Corrigido aqui
        console.log("req.body", req.body.id_activity);

        try {
            const activity = await Activities.find({
                _id: id_activity
            })
                .populate('studentGrades')
                .populate('id_matter')
                .populate('id_teacher')
                .populate('id_class')
                .populate('id_iStQuarter')
                .populate('id_iiNdQuarter')
                .populate('id_iiiRdQuarter')
                .populate('id_ivThQuarter')
                .populate('id_vThQuarter')
                .populate('id_viThQuarter');

            console.log("activity", activity);

            if (activity) {
                return res.json({
                    data: activity,
                    message: 'Success'
                });
            } else {
                return res.status(404).json({
                    message: 'Activity not found'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async createGrade(req, res) {
        const { year, bimonthly, /*totalGrade, averageGrade,*/ studentGrade, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_vThQuarter, id_viThQuarter, id_student, id_teacher, id_teacher02, id_matter, id_class } = req.body;

        // validations
        if (!year) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!studentGrade) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }

        const user = new Grade({
            year: year,
            bimonthly: bimonthly.toUpperCase(),
            //totalGrade: totalGrade,
            //averageGrade: averageGrade,
            studentGrade: studentGrade,
            status: 'ABERTO',
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_vThQuarter,
            id_viThQuarter,
            id_student: id_student,
            id_teacher02,
            id_teacher: id_teacher,
            id_matter: id_matter,
            id_class: id_class
        });

        try {

            const grade = await user.save()

            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_grade: grade._id
                }
            })
            res.status(200).json({
                msg: 'Conta profissional cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async createNumericalGrade(req, res) {
        const { grades } = req.body; // Recebe o array de notas do frontend
        console.log("grades", req.body);
        if (!grades || grades.length === 0) {
            return res.status(422).json({ msg: "O array de notas é obrigatório!" });
        }

        try {
            const insertedGrades = [];

            for (const gradeData of grades) {
                const {
                    year,
                    bimonthly,
                    value,  // Aqui está a nota do aluno
                    studentId,  // Nome correto do campo vindo do frontend
                    idActivity,
                    id_teacher,
                    id_teacher02,
                    id_matter,
                    id_class,
                    id_iStQuarter,
                    id_iiNdQuarter,
                    id_iiiRdQuarter,
                    id_ivThQuarter,
                    id_vThQuarter,
                    id_viThQuarter
                } = gradeData;

                if (!year ) {  // Corrigido para usar 'value' que é a nota
                    return res.status(422).json({ msg: "Ano e nota do estudante são obrigatórios!" });
                }

                // Cria um novo documento no banco
                const grade = new NumericalGrade({
                    year,
                    bimonthly: bimonthly,
                    studentGrade: value,
                    status: 'ABERTO',
                    id_iStQuarter,
                    id_iiNdQuarter,
                    id_iiiRdQuarter,
                    id_ivThQuarter,
                    id_vThQuarter,
                    id_viThQuarter,
                    id_student: studentId,  // Corrigido para 'studentId'
                    idActivity,
                    id_teacher,
                    id_teacher02,
                    id_matter,
                    id_class
                });

                // Salva a nota no banco de dados
                const savedGrade = await grade.save();
                insertedGrades.push(savedGrade);

                // Atualiza o estudante adicionando a nota cadastrada
                await Student.updateOne(
                    { _id: studentId },  // Corrigido para 'studentId'
                    { $push: { numericalGrades: savedGrade._id } }
                );
                await Activities.updateOne(
                    { _id: idActivity },  // Corrigido para 'studentId'
                    { $push: { studentGrades: savedGrade._id } }
                );
            }

            res.status(200).json({
                msg: 'Notas cadastradas com sucesso.',
                insertedGrades
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                msg: 'Erro ao cadastrar as notas.',
                error: err.message
            });
        }
    }


    async GetGrade(req, res) {

        const { year, bimonthly, id_student } = req.body;

        const grade = await Grade.find({
            id_student: id_student
        }).populate('id_student').populate('id_matter').populate('id_teacher').populate('id_class').populate('id_iStQuarter').populate('id_iiNdQuarter').populate('id_iiiRdQuarter').populate('id_ivThQuarter').populate('id_vThQuarter').populate('id_viThQuarter')

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.bimonthly == bimonthly) {
                    return res
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", grade)
        console.log("grd", grd)
        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async GetNumericalGrade(req, res) {
        const { id_activity } = req.body;  // Corrigido aqui
        console.log("req.body", req.body.id_activity);

        try {
            const activity = await NumericalGrade.find({
                idActivity: id_activity
            })
                .populate('id_student')
                .populate('id_matter')
                .populate('id_teacher')
                .populate('id_teacher02')
                .populate('idActivity')
                .populate('id_class')
                .populate('id_iStQuarter')
                .populate('id_iiNdQuarter')
                .populate('id_iiiRdQuarter')
                .populate('id_ivThQuarter')
                .populate('id_vThQuarter')
                .populate('id_viThQuarter');

            console.log("activity", activity);

            if (activity) {
                return res.json({
                    data: activity,
                    message: 'Success'
                });
            } else {
                return res.status(404).json({
                    message: 'Activity not found'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async GetNumGrade (req, res) {

        const { year, bimonthly, id_student } = req.body;

        const grade = await NumericalGrade.find({
            id_student: id_student
        }).populate('id_student').populate('id_matter').populate('id_teacher').populate('id_class').populate('id_iStQuarter').populate('id_iiNdQuarter').populate('id_iiiRdQuarter').populate('id_ivThQuarter').populate('id_vThQuarter').populate('id_viThQuarter')

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.bimonthly == bimonthly) {
                    return res
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grade", grade)
        console.log("grd", grd)
        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async update(req, res) {

        const { update_id_grade, update_studentGrade } = req.body;

        const grade = await Grade.findByIdAndUpdate(update_id_grade, { studentGrade: update_studentGrade }, { new: true });

        try {
            if (!grade) {
                return res.status(404).json({ message: 'Student Grade not found' });
            }
            res.json(grade);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async updateNumericalGrade(req, res) {

        const { update_id_grade, update_studentGrade } = req.body;

        const grade = await NumericalGrade.findByIdAndUpdate(update_id_grade, { studentGrade: update_studentGrade }, { new: true });

        try {
            if (!grade) {
                return res.status(404).json({ message: 'Student Grade not found' });
            }
            res.json(grade);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async indexGrades(req, res) {

        const { year, id_class, id_matter } = req.body;

        const grade = await Grade.find({ id_class: id_class }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    return res
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexNumericalGradesCard(req, res) {

        const { year, id_student } = req.body;

        const grade = await NumericalGrade.find({ id_student: id_student }).populate('id_student').populate('id_matter').populate('id_teacher').populate('id_class').populate('id_iStQuarter').populate('id_iiNdQuarter').populate('id_iiiRdQuarter').populate('id_ivThQuarter').populate('id_vThQuarter').populate('id_viThQuarter');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexGradesCard(req, res) {

        const { year, id_student } = req.body;

        const grade = await Grade.find({ id_student: id_student }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexIstQuarter(req, res) {

        const { year, id_matter, id_iStQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_iStQuarter: id_iStQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexNumericalIstQuarter(req, res) {

        const { year, id_matter, id_iStQuarter, id_class } = req.body;

        const grade = await NumericalGrade.find({ id_iStQuarter: id_iStQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexNumericalIIndQuarter(req, res) {

        const { year, id_matter, id_iiNdQuarter, id_class } = req.body;


        const grade = await NumericalGrade.find({ id_iiNdQuarter: id_iiNdQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexNumericalIIIrdQuarter(req, res) {

        const { year, id_matter, id_iiiRdQuarter, id_class } = req.body;


        const grade = await NumericalGrade.find({ id_iiiRdQuarter: id_iiiRdQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexNumericalIVthQuarter(req, res) {

        const { year, id_matter, id_ivThQuarter, id_class } = req.body;


        const grade = await NumericalGrade.find({ id_ivThQuarter: id_ivThQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexIIndQuarter(req, res) {

        const { year, id_matter, id_iiNdQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_iiNdQuarter: id_iiNdQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexIIIrdQuarter(req, res) {

        const { year, id_matter, id_iiiRdQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_iiiRdQuarter: id_iiiRdQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexIVthQuarter(req, res) {

        const { year, id_matter, id_ivThQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_ivThQuarter: id_ivThQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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
    async indexVthQuarter(req, res) {

        const { year, id_matter, id_vThQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_vThQuarter: id_vThQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async indexVIthQuarter(req, res) {

        const { year, id_matter, id_viThQuarter, id_class } = req.body;

        const grade = await Grade.find({ id_viThQuarter: id_viThQuarter }).populate('id_student');

        console.log("grade", grade)

        const grd = grade.map(res => {
            if (res.year == year) {
                if (res.id_matter == id_matter) {
                    if (res.id_class == id_class) {
                        return res
                    }
                }
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })
        console.log("grd", grd)

        try {
            if (grd) {
                return res.json({
                    data: grd,
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

    async IndexGradeDaily(req, res) {
        const { year: yearData } = req.body;
        const {
            year,
            id_class,
            id_teacher,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_vThQuarter,
            id_viThQuarter,
        } = yearData; // Ajuste para acessar os dados corretamente
        console.log('dados do front', req.body);

        // Cria um objeto de filtro inicial vazio
        const filter = {};

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;
        if (id_vThQuarter) filter.id_vThQuarter = id_vThQuarter;
        if (id_viThQuarter) filter.id_viThQuarter = id_viThQuarter;

        console.log('Filtro inicial:', filter);

        try {
            // Realiza a busca com o filtro construído
            const grade = await Grade.find(filter)
                .populate('id_student')
                .populate('id_teacher')
                .populate('id_class')
                .populate('id_matter');

            console.log('Resultados encontrados no banco:', grade);

            // Filtra os resultados pela `year` (convertendo para string) e `id_class`
            const Grd = grade.filter(res => {
                console.log('Comparando:', {
                    yearFromDB: res.year,
                    yearFromFront: year.toString(), // Convertendo para string
                    idClassFromDB: res.id_class._id.toString(),
                    idClassFromFront: id_class
                });
                return res.year === year.toString() && res.id_class._id.toString() === id_class && res.id_teacher._id.toString() === id_teacher;
            });

            console.log('Resultados após filtro:', Grd);

            if (Grd.length > 0) {
                return res.json({
                    data: Grd,
                    message: 'Success'
                });
            } else {
                return res.json({
                    data: [],
                    message: 'No records found'
                });
            }
        } catch (err) {
            console.log('Erro ao buscar os dados:', err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async IndexGradeDailyTeacher02(req, res) {
        const { year: yearData } = req.body;
        const {
            year,
            id_class,
            id_teacher02,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_vThQuarter,
            id_viThQuarter,
        } = yearData; // Ajuste para acessar os dados corretamente
        console.log('dados do front', req.body);

        // Cria um objeto de filtro inicial vazio
        const filter = {};

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;
        if (id_vThQuarter) filter.id_vThQuarter = id_vThQuarter;
        if (id_viThQuarter) filter.id_viThQuarter = id_viThQuarter;

        console.log('Filtro inicial:', filter);

        try {
            // Realiza a busca com o filtro construído
            const grade = await Grade.find(filter)
                .populate('id_student')
                .populate('id_teacher')
                .populate('id_teacher02')
                .populate('id_class')
                .populate('id_matter');

            console.log('Resultados encontrados no banco:', grade);

            // Filtra os resultados pela `year` (convertendo para string) e `id_class`
            const Grd = grade.filter(res => {
                console.log('Comparando:', {
                    yearFromDB: res.year,
                    yearFromFront: year.toString(),
                    idClassFromDB: res.id_class._id.toString(),
                    idClassFromFront: id_class,
                    idTeacher02FromDB: res.id_teacher02 ? res.id_teacher02._id.toString() : "Sem id_teacher02",
                    idTeacher02FromFront: id_teacher02 || "Sem id_teacher02"
                });

                return (
                    res.year === year.toString() &&
                    res.id_class._id.toString() === id_class &&
                    res.id_teacher02 && // Garante que id_teacher02 existe
                    res.id_teacher02._id.toString() === id_teacher02 // Garante que id_teacher02 corresponde ao filtro
                );
            });


            console.log('Resultados após filtro:', Grd);

            if (Grd.length > 0) {
                return res.json({
                    data: Grd,
                    message: 'Success'
                });
            } else {
                return res.json({
                    data: [],
                    message: 'No records found'
                });
            }
        } catch (err) {
            console.log('Erro ao buscar os dados:', err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async IndexNumericalGradeDaily(req, res) {
        const { year: yearData } = req.body;
        const {
            year,
            id_class,
            id_teacher,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_vThQuarter,
            id_viThQuarter,
        } = yearData; // Ajuste para acessar os dados corretamente
        console.log('dados do front', req.body);

        // Cria um objeto de filtro inicial vazio
        const filter = {};

        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;
        if (id_vThQuarter) filter.id_vThQuarter = id_vThQuarter;
        if (id_viThQuarter) filter.id_viThQuarter = id_viThQuarter;

        console.log('Filtro inicial:', filter);

        try {
            // Realiza a busca com o filtro construído
            const grade = await NumericalGrade.find(filter)
                .populate('id_student')
                .populate('id_teacher')
                .populate('id_class')
                .populate('id_matter');

            console.log('Resultados encontrados no banco:', grade);

            // Filtra os resultados pela `year` (convertendo para string) e `id_class`
            const Grd = grade.filter(res => {
                console.log('Comparando:', {
                    yearFromDB: res.year,
                    yearFromFront: year.toString(), // Convertendo para string
                    idClassFromDB: res.id_class._id.toString(),
                    idClassFromFront: id_class
                });
                return res.year === year.toString() && res.id_class._id.toString() === id_class && res.id_teacher._id.toString() === id_teacher;
            });

            console.log('Resultados após filtro:', Grd);

            if (Grd.length > 0) {
                return res.json({
                    data: Grd,
                    message: 'Success'
                });
            } else {
                return res.json({
                    data: [],
                    message: 'No records found'
                });
            }
        } catch (err) {
            console.log('Erro ao buscar os dados:', err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

}

module.exports = new GradeController();