const Matter = require( "../models/Matter")
const School = require( "../models/School")
const Employee = require( "../models/Employee")

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

    async addMatter(req, res) {
        const { id_employee, id_matter } = req.body;

        // validations
        if (!id_employee) {
            return res.status(422).json({ msg: "O id do professor é obrigatório!" });
        }

        if (!id_matter) {
            return res.status(422).json({ msg: "A id da materia é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const employee = await Employee.find({ _id: id_employee });

        if(employee){
            
           const emp = employee.find(emp =>{
                return emp
            }).id_matter.map(idmatter =>{
                return idmatter
            }).filter(fill => {
                if(fill == id_matter) {
                    return fill
                }
            })
            console.log("filter", emp)
            if(emp.length > 0){                
                return res.status(422).json({msg: "Essa materia ja esta cadastrada nesse professor!" });                
            }
        }

        try {
            
            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_matter: id_matter      
                }
            })

            await Matter.updateOne({
                _id: id_matter
            }, {
                $push: {
                    id_employee: id_employee      
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