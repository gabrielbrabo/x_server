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
        const school = await School.findOne({ _id: id });

        const Employee = await User.find({ _id: school.id_employee });

        if (Employee) {

            const Res = Employee.map( result => {
                if(result.cpf == cpf) {
                    return result.cpf
                }
            })

            if (Res) { 
                const fil = Res.filter((fill) => {
                    if(fill == cpf) {
                        return fill
                    }
                })
                console.log("filter", fil)
                if(fil.length > 0) {    
                    return res.status(422).json({ msg: "Essa cpf ja esta cadastrado nesta Escola!" });
                }
                
            }

        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            name: name.toUpperCase(),
            cpf,
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