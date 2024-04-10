const School = require( "../models/School")
const Student = require( "../models/Student")
const bcrypt = require('bcryptjs')

class StudentController {
  
    async create(req, res) {
        const { name, rg, password, confirmpassword, registerStudent } = req.body;

        const { id } = req.params;

        // validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

        if (!rg) {
            return res.status(422).json({ msg: "O RG é obrigatório!" });
        }

        if (!registerStudent) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
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
        const userExists = await Student.findOne({ rg: rg });

        if (userExists) {
            return res.status(422).json({ msg: "Esse estudante ja esta cadastrado!" });
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new Student({
            name: name.toUpperCase(),
            rg: rg,
            type: "student",
            registerStudent: registerStudent,
            id_school: id,
            password: passwordHash
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

        } catch (err){
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async index(req, res) {

        const {idSchool} = req.body;

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
  
    async update(req, res) {
        try {
            const { id } = req.params;
            const { email, password } = req.body;
            const user = await User.findById(id);
  
            if (!user) {
                return res.status(404).json();
            }

            const encryptedPassword = await createPasswordHash(password)
  
            await user.updateOne({email, password: encryptedPassword });
    
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
  
    async destroy(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
    
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