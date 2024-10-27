const Employee = require("../models/Employee");
const User = require("../models/Employee")
const School = require("../models/School")
const AddTeacher = require("../models/AddTeacher")
const RecordClassTaught = require("../models/RecordClassTaught")
const bcrypt = require('bcryptjs')

class EmployeeController {

    async create(req, res) {
        const { name, dateOfBirth, cpf, rg, email, cellPhone, address, position_at_school, password, confirmpassword } = req.body;

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
            dateOfBirth,
            cpf,
            rg,
            email,
            cellPhone,
            address: address.toUpperCase(),
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
                name_employee: employee.name,
                id_employee: employee._id,
                msg: 'Conta profissional cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async index(req, res) {

        const { idSchool } = req.body;

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

    async InfoIndex(req, res) {

        const { id } = req.params;

        try {
            const employee = await Employee.findById({
                _id: id
            }).populate('id_matter').populate('id_class')

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

    async MyClassIndex(req, res) {

        const { id_class, id_teacher } = req.body;

        const clss = await AddTeacher.find({ id_class: id_class });
        const result = clss.map(res => {
            if (res.id_teacher == id_teacher) {
                return res
            }
        })

        try {
            if (result) {
                const filter = result.filter(res => {
                    if (res !== null) {
                        return res
                    }
                })
                return res.json({
                    data: filter,
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

    async getEmployeeById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
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
            const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(employee);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
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

            return res.status(200).json({ msg: "Usuario removido com sucesso" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async RecordClassTaught(req, res) {
        const { day, month, year, description, id_teacher, id_class } = req.body;

        // validations
        if (!day) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!year) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }


        //const school = await School.findOne({ _id: id_school });

        const existingRecordClassTaught = await RecordClassTaught.find({ id_class: id_class })

        console.log("existingBimonthly", existingRecordClassTaught)
        if (existingRecordClassTaught) {
            const result = existingRecordClassTaught.map(Res => {
                if (Res.year == year) {
                    if (Res.month == month) {
                        if (Res.day == day) {
                            return Res
                        }
                    }
                }
                return null
            }).filter(Res => {
                if (Res !== null) {
                    return Res
                }
            })
            console.log("result", result)
            if (result.length > 0) {
                return res.status(422).json({ msg: "A aula ja foi definido voçê so podera editalo!" });
            }
        }

        const recordClassTaught = new RecordClassTaught({
            day,
            month,
            year,
            description,
            id_teacher,
            id_class
        });

        try {

            const recordClass = await recordClassTaught.save()

            await Employee.updateOne({
                _id: id_teacher
            }, {
                $push: {
                    id_recordClassTaught: recordClass._id
                }
            })
            res.status(200).json({
                msg: 'Conta profissional cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async indexRecordClassTaught(req, res) {

        const {
            year,
            id_class
        } = req.body;

        try {
            const recordClass = await RecordClassTaught.find({
                id_class: id_class
            }).populate('id_teacher').populate('id_class')

            if (recordClass) {
                const result = recordClass.map(Res => {
                    if (Res.year == year) {

                        return Res
                    }
                }).filter(Res => {
                    if (Res !== null) {
                        return Res
                    }
                })
                return res.json({
                    data: result,
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

module.exports = new EmployeeController();