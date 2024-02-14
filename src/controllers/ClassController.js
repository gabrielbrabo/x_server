const Class = require( "../models/Class")
const School = require( "../models/School")

class ClassController {
  
    async create(req, res) {
        const { year, serie, level, shift, classroom_number} = req.body;

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

        const clss = await Class.find({ _id: school.id_class });

        if (clss) {

            const Res = clss.map( result => {
                if(result.serie == serie.toUpperCase()) {
                    return result.year
                }
            })
            
            if (Res) { 
                const fil = Res.filter((fill) => {
                    if(fill == year) {
                        return fill
                    }
                })
                console.log("filter", fil)
                if(fil.length == [1]) {    
                    return res.status(422).json({ msg: "Essa truma ja esta cadastrada!" });
                }
            }

        }

        // create user
        const newclass = new Class({
            year: year, 
            serie: serie.toUpperCase(), 
            level: level.toUpperCase(), 
            shift: shift.toUpperCase(), 
            classroom_number: classroom_number,
            id_school: id
        })

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

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }
}
  
module.exports = new ClassController();