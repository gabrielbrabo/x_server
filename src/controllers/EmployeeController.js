const User = require( "../models/Employee")
const School = require( "../models/School")
const bcrypt = require('bcryptjs')

class EmployeeController {
  
    async create(req, res) {
        const { name, cpf, position_at_school, password, confirmpassword } = req.body;

        const { id } = req.params;

        // validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

        if (!cpf) {
            return res.status(422).json({ msg: "O cpf é obrigatório!" });
        }

        if (!position_at_school) {
            return res.status(422).json({ msg: "O cargo do funcionario é obrigatório!" });
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
        const userExists = await User.findOne({ cpf: cpf });

        if (userExists) {
            return res.status(422).json({ msg: "Esse cpf ja esta cadastrado!" });
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            name: name.toUpperCase(),
            cpf,
            type: 'employee',
            position_at_school: position_at_school.toUpperCase(),
            id_school: id,
            password: passwordHash
        });

        try {
            
            const employee = await user.save()
            
            await School.updateOne({
                _id: id
            }, {
                $push: {
                    id_employee: employee._id      
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
            const employee = await School.findById({
                _id: idSchool
            }).populate('id_employee')

            if (employee) {
                return res.json({
                    data: employee.id_employee,
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
  
module.exports = new EmployeeController();