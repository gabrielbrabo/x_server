const EducationDepartment = require("../models/EducationDepartment")
const EmployeeEducationDepartment = require("../models/EmployeeEducationDepartment")
const School = require("../models/School")
const crypto = require('crypto');
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
        const gerarCodigo = () => {
            return String(Math.floor(Math.random() * 9000000) + 1000000);
        };
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
            EmployeeCode: gerarCodigo(),
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

    async ForgotPasswordEduDep(req, res) {

        const { cpf } = req.body;
        console.log("dados do front", cpf)

        function generateResetToken() {
            return crypto.randomBytes(32).toString('hex'); // Gera um token aleatório em formato hexadecimal
        }

        const user = await EmployeeEducationDepartment.find({ cpf });
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const userEmail = user.find(res => {
            return res
        })

        const Schemas = userEmail._id; // Substitua isso por sua lógica dinâmica, se necessário
        const email = userEmail.email; // Substitua isso por sua lógica dinâmica, se necessário
        console.log("usuario", user)
        console.log("userEmail", userEmail)
        console.log("email", email)
        console.log("Schemas", Schemas)

        const resetToken = generateResetToken(); // Função para criar um token
        console.log("resetToken", resetToken)
        userEmail.resetToken = resetToken;
        userEmail.resetTokenExpiry = Date.now() + 3600000; // 1 hora
        await userEmail.save();


        const nodemailer = require('nodemailer');

        const baseUrl = process.env.BASE_URL;
        const resetLink = `${baseUrl}/reset-password-education-department/${cpf}/${Schemas}/${resetToken}`;
        sendEmail(email, resetLink);

        async function sendEmail(email, resetLink) {
            const transporter = nodemailer.createTransport({
                service: 'gmail', // ou outro serviço de e-mail
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: 'gsgxdevelopement@gmail.com',
                to: email,
                subject: 'Redefinição de Senha',
                text: `Clique aqui para redefinir sua senha: ${resetLink}`,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`E-mail enviado para ${email}`);
            } catch (error) {
                console.error('Erro ao enviar e-mail:', error);
            }
        }

        return res.json({
            msg: `Enviamos um link de recuperação de senha para o e-mail: ${userEmail.email}. Por favor, verifique sua caixa de entrada. Se não localizá-lo, confira também a pasta de spam ou lixo eletrônico.`
        });
    }

    async ResetPasswordEducationDepartment(req, res) {
        const { cpf, id, token, newPassword } = req.body;

        try {
            // 1. Verifica se o usuário existe pelo CPF
            const user = await EmployeeEducationDepartment.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // 2. Verifica se o token é válido
            if (user.resetToken !== token) {
                return res.status(400).json({ error: 'Token inválido.' });
            }

            // 3. Verifica se o token expirou
            if (Date.now() > user.resetTokenExpiry) {
                return res.status(400).json({ error: 'Token expirado.' });
            }

            // 4. Gera um hash da nova senha
            //const salt = await bcrypt.genSalt(10);
            //const hashedPassword = await bcrypt.hash(newPassword, salt);

            // 5. Atualiza a senha e remove o token
            user.password = newPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            // 6. Atualiza outros modelos que possuem o mesmo CPF
            const updateData = { password: newPassword };
            await Promise.all([
                EmployeeEducationDepartment.updateMany({ cpf }, updateData),
                // Adicione outros modelos conforme necessário
            ]);

            res.json({ message: 'Senha atualizada com sucesso. Agora podera fazer login com a nova senha.' });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async InfoIndexEduDep(req, res) {

        const { id } = req.params;

        try {
            const employee = await EmployeeEducationDepartment.findById({
                _id: id
            }).populate('idEducationDepartment')
            /*const info = await AddTeacher.find({
                id_teacher: id
            }).populate('id_class')*/
            //console.log("info", info)
            if (employee /*&& info*/) {
                return res.json({
                    data: [employee],
                    //info: [info],
                    message: 'Sucess'
                })
            } /*else {
                return res.json({
                    data: [employee],
                    message: 'Sucess'
                })
            }*/
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'there was an error on server side!'
            })
        }
    }

    async getEmployeeDepEduById(req, res) {
        try {
            const employee = await EmployeeEducationDepartment.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(employee);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const employee = await EmployeeEducationDepartment.findByIdAndUpdate(id, req.body, { new: true });
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(employee);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updatePassword(req, res) {
        const { cpf, id, password, newPassword } = req.body;

        try {
            // 1. Verifica se o usuário existe pelo CPF
            const user = await EmployeeEducationDepartment.findOne({ _id: id, password: password });
            if (!user) {
                return res.status(404).json({ error: 'Senha atual errada ou usuário não encontrado.' });
            }

            console.log("user", user)
            console.log("password", password)
            user.password = newPassword;
            await user.save();

            // 6. Atualiza outros modelos que possuem o mesmo CPF
            const updateData = { password: newPassword };
            await Promise.all([
                EmployeeEducationDepartment.updateMany({ cpf }, updateData),
                // Adicione outros modelos conforme necessário
            ]);

            res.json({ message: 'Senha atualizada com sucesso.' });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    async indexEmpEduDep(req, res) {

        const { idEducationDepartment } = req.body;

        try {
            const employee = await EducationDepartment.findById({
                _id: idEducationDepartment
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
}

module.exports = new EducationDepartmentController();