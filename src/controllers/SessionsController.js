const jwt = require('jsonwebtoken')
const User = require('../models/School')
const Employee = require('../models/Employee')
const authConfig = require('../config/auth')
const bcrypt = require('bcryptjs')

class SessionController {
    async sessionSchool(req, res) {
        const { email, password } = req.body;

        // validations
        if (!email) {
            return res.status(421).json({ msg: "O email é obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // check if user exists
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }
        
        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }
        console.log(user)
        const name = user.name
        const { id } = user
        const id_employee = user.id_employee
        const type = user.type
        const id_matter = user.id_matter
        const id_class = user.id_class
        
        return res.json({
            
            id,
            email,
            name,
            type,
            id_employee,
            id_matter,
            id_class,

            
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }

    async sessionEmployee(req, res) {
        const { cpf, password } = req.body;

        // validations
        if (!cpf) {
            return res.status(421).json({ msg: "O cpf é obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // check if user exists
        const user = await Employee.findOne({ cpf: cpf });
        
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }
        
        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }
        console.log(user)
        const id = user._id
        const name = user.name
        const { CPF } = user
        const position_at_school = user.position_at_school
        const type = user.type
        const id_school = user.id_school
        const id_matter = user.id_matter
        const id_class = user.id_class
        const id_reporter_card = user.id_reporter_card
        
        return res.json({
            
            id,
            CPF,
            name,
            position_at_school,
            type,
            id_school,
            id_matter,
            id_class,
            id_reporter_card,

            
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }
}

module.exports = new SessionController()