const EducationDepartment = require("../models/EducationDepartment")
const EmployeeEducationDepartment = require("../models/EmployeeEducationDepartment")
const School = require("../models/School")
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

class EducationDepartmentController {

    async create(req, res) {
        const {
            name,
            email,
            municipality,
            state,
            address
        } = req.body;

        // validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatório!" });
        }

        if (!municipality) {
            return res.status(422).json({ msg: "O municipio e obrigatorio!" });
        }

        if (!address) {
            return res.status(422).json({ msg: "O endereço e obrigatorio!" });
        }

        if (!state) {
            return res
                .status(422)
                .json({ msg: "O estado e obrigatorio!" });
        }

        // check if user exists
        const userExists = await EducationDepartment.findOne({ email: email });

        if (userExists) {
            return res.json({ email, msg: "Por favor, utilize outro e-mail!" });
        }

        // create user
        const user = new EducationDepartment({
            name,
            email,
            municipality,
            state,
            address,
            type: "education-department"
        });

        if (user) {
            await user.save();

            const name = user.name
            const email = user.email
            const { id } = user

            return res.json({

                id,
                email,
                name,
                token: jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                })
            })

        } else {
            res.status(500).json({ msg: error });
        }
    }

    async NewEmpEducationDepartament(req, res) {
        const { name, dateOfBirth, cpf, rg, email, cellPhone, address, positionAtEducationDepartment, password, confirmpassword } = req.body;
        const { id } = req.params;
        console.log("Dados recebidos:", req.body); // Adicione este log
        // Validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }
        if (!cpf) {
            return res.status(422).json({ msg: "O cpf é obrigatório!" });
        }
        if (!positionAtEducationDepartment) {
            return res.status(422).json({ msg: "O cargo do funcionário é obrigatório!" });
        }
        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }
        if (password != confirmpassword) {
            return res.status(422).json({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        // Check if user exists with the same CPF and id_school
        const userExists = await EmployeeEducationDepartment.findOne({ cpf: cpf, idEducationDepartment: id });
        if (userExists) {
            return res.status(422).json({ msg: "Esse CPF já está cadastrado para esta escola!" });
        }

        // Create password hash
        //const salt = await bcrypt.genSalt(12);
        //const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const user = new EmployeeEducationDepartment({
            name: name.toUpperCase(),
            dateOfBirth,
            cpf,
            rg,
            email,
            cellPhone,
            address: address.toUpperCase(),
            type: 'employee',
            positionAtEducationDepartment: positionAtEducationDepartment.toUpperCase(),
            idEducationDepartment: id,
            password: password
        });

        try {
            console.log("Criando usuário...");
            const employee = await user.save();

            console.log("Atualizando escola...");
            await EducationDepartment.updateOne(
                { _id: id },
                { $push: { id_employee: employee._id } }
            );

            res.status(200).json({
                name_employee: employee.name,
                id_employee: employee._id,
                msg: 'Conta profissional cadastrada com sucesso.'
            });
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            res.status(500).json({
                msg: 'Erro ao cadastrar uma conta profissional.'
            });
        }
    }

    async index(req, res) {

        const { idEducationDepartment } = req.body;

        try {
            const schools = await EducationDepartment.findById({
                _id: idEducationDepartment
            }).populate('id_schools')
                .populate('id_employee')

            if (schools) {
                return res.json({
                    data: schools,
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

    async indexName(req, res) {

        const { idEducationDepartment } = req.body;

        try {
            const school = await EducationDepartment.findById({
                _id: idEducationDepartment
            })

            if (school) {
                return res.json({
                    data: school.name,
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

    async indexSchool(req, res) {
        const { idSchool } = req.body;

        console.log("id da escola", idSchool)

        try {
            const school = await School.findById({
                _id: idSchool
            }).populate('id_employee')
                .populate('id_matter')
                .populate('id_class')
                .populate('id_student')
                .populate('id_iStQuarter')
                .populate('id_iiNdQuarter')
                .populate('id_iiiRdQuarter')
                .populate('id_ivThQuarter')

            if (school) {
                return res.json({
                    data: school,
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

            await user.updateOne({ email, password: encryptedPassword });

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

    async getLogoSchool(req, res) {

        const { idSchool } = req.body;

        try {
            const school = await User.findById({
                _id: idSchool
            })

            // console.log()

            if (school) {
                return res.json({
                    data: school,
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
}

module.exports = new EducationDepartmentController();