const jwt = require('jsonwebtoken')
const EducationDepartment = require('../models/EducationDepartment')
const User = require('../models/School')
const EmployeeEducationDepartment = require('../models/EmployeeEducationDepartment')
const Employee = require('../models/Employee')
const authConfig = require('../config/auth')
const bcrypt = require('bcryptjs')

class SessionController {
    async sessionSchool(req, res) {
        const { id, password } = req.body;

        // validations
        if (!id) {
            return res.status(421).json({ msg: "O id é obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // check if user exists
        const user = await User.findOne({ _id: id });

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
        const { _id } = user
        const id_employee = user.id_employee
        const type = user.type
        const id_matter = user.id_matter
        const id_class = user.id_class

        return res.json({

            _id,
           // email,
            name,
            type,
            id_employee,
            id_matter,
            id_class,


            token: jwt.sign({ _id }, authConfig.secret, {
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
        const users = await Employee.findOne({ cpf: cpf, password: password })//.populate('id_school');
        const populateLogo = await Employee.findOne({ cpf: cpf }).populate('id_school');
        //console.log("userName:", populateLogo.name, "id:", populateLogo._id)
        if (!users) {
            return res.status(404).json({ msg: "Cpf ou senha esta errado!" });
        }
        const usersWithSameCpf = await Employee.find({ cpf: cpf });

        if (usersWithSameCpf.length > 1) {
            if (usersWithSameCpf.length > 1) {
                const schools = usersWithSameCpf.map(user => user.id_school); // Adapte conforme necessário para pegar informações da escola
                console.log("schools", schools);
                return res.json({
                    msg: "Você tem mais de uma escola registrada.",
                    schools: schools.map(school => ({
                        id: school,
                        name: school.name // Substitua pelo nome real da escola que você terá em seu banco de dados
                    })),
                });
            }
        }

        // Se o usuário tiver apenas um registro
        //console.log(users)
        const id = users._id
        const name = users.name
        const CPF = users.cpf
        const position_at_school = users.position_at_school
        const type = users.type
        const id_school = users.id_school
        const id_matter = users.id_matter
        const id_class = users.id_class
        const id_reporter_card = users.id_reporter_card
        //const logoSchool = populateLogo.id_school.logo
        //const assessmentFormat = populateLogo.id_school.assessmentFormat

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
            //logoSchool,
            //assessmentFormat,

            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }

    async loginWithSchool(req, res) {
        const { cpf, id_school } = req.body;

        // Validações
        if (!cpf) {
            return res.status(421).json({ msg: "O CPF é obrigatório!" });
        }

        if (!id_school) {
            return res.status(423).json({ msg: "O ID da escola é obrigatório!" });
        }

        // Busca o usuário com CPF e id_school específicos
        const user = await Employee.findOne({ cpf: cpf, id_school: id_school });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado para a escola especificada!" });
        }

        // Validação da senha
        /*const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }*/

        // Se o login for bem-sucedido, retorna as informações do usuário
        const { _id, name, position_at_school, type, id_matter, id_class, id_reporter_card } = user;

        return res.json({
            id: _id,
            CPF: user.cpf,
            name,
            position_at_school,
            type,
            id_school,
            id_matter,
            id_class,
            id_reporter_card,
            token: jwt.sign({ id: _id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }

    async sessionEducationDepartment(req, res) {
        const { id } = req.body;

        // validations
        if (!id) {
            return res.status(421).json({ msg: "O id é obrigatório!" });
        }

        // check if user exists
        const user = await EducationDepartment.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        console.log(user)
        const name = user.name
        const _id  = user._id
        const id_employee = user.id_employee
        const type = user.type
        const schools = user.id_school

        return res.json({

            _id,
            name,
            type,
            id_employee,
            schools,


            token: jwt.sign({ _id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }

    async sessionEmployeeEducationDepartment(req, res) {
        const { cpf, password } = req.body;

        // validations
        if (!cpf) {
            return res.status(421).json({ msg: "O cpf é obrigatório!" });
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // check if user exists
        const users = await EmployeeEducationDepartment.findOne({ cpf: cpf, password: password })//.populate('id_school');
        const populateLogo = await EmployeeEducationDepartment.findOne({ cpf: cpf }).populate('idEducationDepartment');
        console.log("uses", populateLogo)
        if (!users) {
            return res.status(404).json({ msg: "Cpf ou senha esta errado!" });
        }
        /*const usersWithSameCpf = await EmployeeEducationDepartment.find({ cpf: cpf });

        if (usersWithSameCpf.length > 1) {
            if (usersWithSameCpf.length > 1) {
                const schools = usersWithSameCpf.map(user => user.idEducationDepartment); // Adapte conforme necessário para pegar informações da escola
                console.log("schools", schools);
                return res.json({
                    msg: "Você tem mais de uma escola registrada.",
                    schools: schools.map(school => ({
                        id: school,
                        name: school.name // Substitua pelo nome real da escola que você terá em seu banco de dados
                    })),
                });
            }
        }*/

        // Se o usuário tiver apenas um registro
        //console.log(users)
        const id = users._id
        const name = users.name
        const CPF = users.cpf
        const positionAtEducationDepartment = users.positionAtEducationDepartment
        const type = users.type
        const idEducationDepartment = users.idEducationDepartment
        //const logoSchool = populateLogo.id_school.logo
        //const assessmentFormat = populateLogo.id_school.assessmentFormat

        return res.json({

            id,
            CPF,
            name,
            positionAtEducationDepartment,
            type,
            idEducationDepartment,

            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }

}

module.exports = new SessionController()