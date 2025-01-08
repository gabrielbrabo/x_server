const Grade = require("../models/Grade")
const Student = require( "../models/Student")

class GradeController {

    async createGrade(req, res) {
        const { year, bimonthly, /*totalGrade, averageGrade,*/ studentGrade, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_vThQuarter,id_viThQuarter, id_student, id_teacher, id_matter, id_class } = req.body;

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

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async GetGrade(req, res) {

        const { year, bimonthly, id_student } = req.body;

        const grade = await Grade.find({
            id_student: id_student
        }).populate('id_student').populate('id_matter').populate('id_teacher').populate('id_iStQuarter').populate('id_iiNdQuarter').populate('id_iiiRdQuarter').populate('id_ivThQuarter').populate('id_vThQuarter').populate('id_viThQuarter')

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

    async indexGrades(req, res) {

        const { year, id_class, id_matter} = req.body;

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

        const { year, id_matter, id_iStQuarter, id_class} = req.body;

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

    async indexIIndQuarter(req, res) {

        const { year, id_matter, id_iiNdQuarter, id_class} = req.body;

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

        const { year, id_matter, id_iiiRdQuarter, id_class} = req.body;

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

        const { year, id_matter, id_ivThQuarter, id_class} = req.body;

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

        const { year, id_matter, id_vThQuarter, id_class} = req.body;

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

        const { year, id_matter, id_viThQuarter, id_class} = req.body;

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
                return res.year === year.toString() && res.id_class._id.toString() === id_class;
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