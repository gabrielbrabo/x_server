const Matter = require( "../models/Matter")
const School = require( "../models/School")
const Employee = require( "../models/Employee")
const modelClass = require( "../models/Class")
const modelTeacher = require( "../models/AddTeacher")

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

    async index(req, res) {

        const {idSchool} = req.body;

        try {
            const matter = await School.findById({
                _id: idSchool
            }).populate('id_matter')

            if (matter) {
                return res.json({
                    data: matter.id_matter,
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
                msg: 'Materia adicionada com sucesso.'
            })

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }

    async removeMatter(req, res) {
        const { id_matter, id_employee } = req.body;
        // validations
        if (!id_matter) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }

        if (!id_employee) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }

        // Check if the student is already registered in a class
        const matter = await Matter.find({ _id: id_matter });
        if(! matter) {
            return res.status(422).json({ msg: "A materia não existe!" });
        }
        const employee = await Employee.find({ _id: id_employee });
        if(! employee) {
            return res.status(422).json({ msg: "O estudante não existe!" });
        }
        const modeltchr = await modelTeacher.find({ 
            id_teacher: id_employee,
            id_matter: id_matter
        })
        const empTeacher = modeltchr.map(res => {
            return res._id
        })
        console.log("modeltchr", empTeacher)
        try {
            
            await Employee.updateOne({
                _id: id_employee
            }, {
                $pull: {
                    id_matter: id_matter     
                }
            })

            await Matter.updateOne({
                _id: id_matter
            }, {
                $pull: {
                    id_employee: id_employee      
                }
            })
            await modelTeacher.deleteMany({ _id: empTeacher })
            res.status(200).json({
                msg: 'Materia removido com sucesso.'
            })

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }
    
    async deleteMatter(req, res) {
        const { id_matter } = req.body;
        // validations
        if (!id_matter) {
            return res.status(422).json({ msg: "O id do estudante é obrigatório!" });
        }

        /*if (!id_employee) {
            return res.status(422).json({ msg: "A id da turma é obrigatório!" });
        }*/

        // Check if the student is already registered in a class
        const matter = await Matter.findOne({
            _id: id_matter
        }).populate('id_employee').populate('id_class')

        const emp = matter.id_employee.map(res => {
            return res._id
        })
        const clas = matter.id_class.map(res => {
            return res._id
        })
        const tchr = await modelTeacher.find({
            id_matter: id_matter
        })
        const addTeacher = tchr.map(res => {
            return res._id
        })
        
        console.log("matter",addTeacher)

        try {
            await Employee.updateMany({
                _id: emp
            }, {
                $pull: {
                    id_matter: id_matter     
                }
            })
            await Employee.updateMany({
                _id: emp
            }, {
                $pull: {
                    id_class: clas     
                }
            })
            await modelClass.updateMany({
                _id: clas
            }, {
                $pull: {
                    id_matter: id_matter     
                }
            })
            await modelClass.updateMany({
                _id: clas
            }, {
                $pull: {
                    id_employee: emp     
                }
            })
            await modelClass.updateMany({
                _id: clas
            }, {
                $pullAll: {
                    addTeacher: addTeacher     
                }
            })
            await modelTeacher.deleteMany({ _id: addTeacher })
            await Matter.deleteOne({ _id: id_matter })
            res.status(200).json({
                msg: 'Materia removido com sucesso.'
            })
        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma turma.'
            })
        }
    }
}
module.exports = new MatterController();