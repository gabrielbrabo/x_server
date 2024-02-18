const Matter = require( "../models/Matter")
const School = require( "../models/School")

class MatterController {
  
    async create(req, res) {
        const { name } = req.body;

        const { id } = req.params;

        // validations
        if (!name) {
            return res.status(422).json({ msg: "A materia é obrigatório!" });
        }

        // check if class exists
        const school = await School.findOne({ _id: id });

        const matter = await Matter.find({ _id: school.id_matter });

        if (matter) {

            const Res = matter.map( result => {
                return result.name
            })

            if(Res){
                const fil = Res.filter((fill) => {
                    if(fill == name.toUpperCase()) {
                        return fill
                    }
                })
                
                if(fil.length > 0) { 
                    console.log("filter", fil)   
                    return res.status(422).json({ msg: "Essa materia ja esta cadastrada!" });
                }
            }
        }

        // create user
        const newmatter = new Matter({ 
            name: name.toUpperCase(),
            id_school: id
        })

        try {
            
            const matter = await newmatter.save()
            
            await School.updateOne({
                _id: id
            }, {
                $push: {
                    id_matter: matter._id      
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
  
module.exports = new MatterController();