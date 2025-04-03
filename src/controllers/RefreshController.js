const jwt = require('jsonwebtoken')
const User = require('../models/Employee')
const Employee = require('../models/Employee')
const authConfig = require('../config/auth')

class RefreshController {

    async checkToken(req, res) {
        const { id } = req.body;

        const user = await User.findOne({ _id: id });
        console.log("user", user)

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        
        //const avatar = user.avataruser
        const ID  = user
        const name = user.name
        const email = user.email
        const CPF  = user.cpf
        const position_at_school = user.position_at_school
        const type = user.type
        const id_school = user.id_school
        const id_matter = user.id_matter
        const id_class = user.id_class
        const id_reporter_card = user.id_reporter_card

        const usersWithSameCpf = await Employee.find({ cpf: user.cpf });

        if (usersWithSameCpf.length > 1) {
            if (usersWithSameCpf.length > 1) {
                const schools = usersWithSameCpf.map(user => user.id_school); // Adapte conforme necessário para pegar informações da escola
                console.log("schools", schools);
                return res.json({
                    msg: "Você tem mais de uma escola registrada.",
                    schools: schools.map(school => ({
                        id: school,
                        name: school.name, // Substitua pelo nome real da escola que você terá em seu banco de dados
                        cpf: user.cpf
                    })),
                });
            }
        }
        
        return res.json({
            
            id,
            email,
           // avatar,
            name,
            CPF,
            position_at_school,
            type,
            id_school,
            id_matter,
            id_class,
            id_reporter_card,
            
            token: jwt.sign({ ID }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }
}

module.exports = new RefreshController()