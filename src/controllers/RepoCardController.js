const Employee = require( "../models/Employee")
const Student = require( "../models/Student")
const Cards = require( "../models/Report_card")
const Matter = require( "../models/Matter")

class StudentController {
  
    async create(req, res) {
        const { year, id_matter, id_employee, id_student } = req.body;

        // validations
        if (!year) {
            return res.status(422).json({ msg: "O Ano é obrigatório!" });
        }

        if (!id_matter) {
            return res.status(422).json({ msg: "A serie da turma é obrigatório!" });
        }

        if (!id_employee) {
            return res.status(422).json({ msg: "O nivel da turma é obrigatório!" });
        }

        if (!id_student) {
            return res.status(422).json({ msg: "o turno é obrigatória!" });
        }

        // check if class exists
        const student = await Student.findOne({ _id: id_student });

        const card = await Cards.find({ _id: student.id_reporter_card });

        if (card) {
            
            const Res = card.map( result => {
                if(result.year == year) {
                    return result.id_matter
                }
            }).map( result => {
                if(result == id_matter) {
                    return result
                }
            }).filter((fill) => {
                return fill
            })
            
            if(Res.length > 0) {    
                return res.status(422).json({Res, msg: "Essa truma ja esta cadastrada!" });
            }
        }

        // create user
        const newreportCards = new Cards({
            year: year, 
            id_matter: id_matter, 
            id_employee: id_employee, 
            id_student: id_student
        })

        try {
            
            const reportCards = await newreportCards.save()
            
            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_reporter_card: reportCards._id      
                }
            })

            await Employee.updateOne({
                _id: id_employee
            }, {
                $push: {
                    id_reporter_card: reportCards._id      
                }
            })

            await Matter.updateOne({
                _id: id_matter
            }, {
                $push: {
                    id_reporter_card: reportCards._id      
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

    async I_st_quarter(req, res) {
        try {
            const { id_reporter_card, id_student, id_employee, I_st_quarter } = req.body;
            const card = await Cards.find({_id: id_reporter_card});
  
            if (!card) {
                return res.status(404).json();
            }

            const crdst = card.find(crd =>{
                return crd
            }).id_student.map(st => {
                return st
            })

            const crdemp = card.find(crd =>{
                return crd
            }).id_employee.map(emp => {
                return emp
            })

            if(crdst == id_student & crdemp == id_employee){
                await Cards.updateOne({_id: id_reporter_card,  I_st_quarter: I_st_quarter});
                return res.status(200).json({crdst, crdemp});
            }
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async II_nd_quarter(req, res) {
        try {
            const { id_reporter_card, id_student, id_employee, II_nd_quarter } = req.body;
            const card = await Cards.find({_id: id_reporter_card});
  
            if (!card) {
                return res.status(404).json();
            }

            const crdst = card.find(crd =>{
                return crd
            }).id_student.map(st => {
                return st
            })

            const crdemp = card.find(crd =>{
                return crd
            }).id_employee.map(emp => {
                return emp
            })

            if(crdst == id_student & crdemp == id_employee){
                await Cards.updateOne({_id: id_reporter_card,  II_nd_quarter: II_nd_quarter});
                return res.status(200).json({crdst, crdemp});
            }
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async III_rd_quarter(req, res) {
        try {
            const { id_reporter_card, id_student, id_employee, III_rd_quarter } = req.body;
            const card = await Cards.find({_id: id_reporter_card});
  
            if (!card) {
                return res.status(404).json();
            }

            const crdst = card.find(crd =>{
                return crd
            }).id_student.map(st => {
                return st
            })

            const crdemp = card.find(crd =>{
                return crd
            }).id_employee.map(emp => {
                return emp
            })

            if(crdst == id_student & crdemp == id_employee){
                await Cards.updateOne({_id: id_reporter_card,  III_rd_quarter: III_rd_quarter});
                return res.status(200).json({crdst, crdemp});
            }
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    async IV_th_quarter(req, res) {
        try {
            const { id_reporter_card, id_student, id_employee, IV_th_quarter } = req.body;
            const card = await Cards.find({_id: id_reporter_card});
  
            if (!card) {
                return res.status(404).json();
            }

            const crdst = card.find(crd =>{
                return crd
            }).id_student.map(st => {
                return st
            })

            const crdemp = card.find(crd =>{
                return crd
            }).id_employee.map(emp => {
                return emp
            })

            if(crdst == id_student & crdemp == id_employee){
                await Cards.updateOne({_id: id_reporter_card,  IV_th_quarter: IV_th_quarter});
                return res.status(200).json({crdst, crdemp});
            }
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

}
  
module.exports = new StudentController();