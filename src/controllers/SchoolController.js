const User = require( "../models/School")
const EducationDepartment = require( "../models/EducationDepartment")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

class SchoolController {
  
    async create(req, res) {
        const { name, city, address, assessmentFormat, password, confirmpassword, educationDep } = req.body;
        console.log("dados", req.body)
        // validations
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório!" });
        }

       /* if (!email) {
            return res.status(422).json({ msg: "O email é obrigatório!" });
        }*/

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        if (password != confirmpassword) {
            return res
            .status(422)
            .json({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        // check if user exists
       /* const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(422).json({ email, msg: "Por favor, utilize outro e-mail!" });
        }*/

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            name,
            //email,
            city, 
            address,
            assessmentFormat,
            type: "school",
            password: passwordHash,
            educationDepartment: educationDep
        });

        if(user) {
            await user.save();

            console.log("Atualizando departemento de educação...");
            await EducationDepartment.updateOne(
                { _id: educationDep },
                { $push: { id_schools: user._id } }
            );

            const name = user.name
            //const email = user.email
            const assessmentFormat = user.assessmentFormat
            const { id } = user

            return res.json({
            
                id,
                //email,
                name,
                assessmentFormat,
                token: jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                })
            })

        } else {
            res.status(500).json({ msg: error });
        }
    }

    async getSchool (req, res) {

        const {idSchool} = req.body;
        console.log("idSchool", idSchool)
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

    async index(req, res) {

        const {idSchool} = req.body;

        try {
            const school = await User.findById({
                _id: idSchool
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

    async indexSchools(req, res) {
        const { idSchools } = req.body; // Recebe um array de IDs de escolas
    
        if (!Array.isArray(idSchools)) {
            return res.status(400).json({ message: 'idSchools deve ser um array de IDs' });
        }
    
        try {
            // Busca todas as escolas cujos IDs estão no array 'idSchools'
            const schools = await User.find({
                _id: { $in: idSchools }
            });
    
            // Verifica se encontrou as escolas
            if (schools && schools.length > 0) {
                return res.json({
                    data: schools.map(school => ({ id: school._id, name: school.name })),
                    message: 'Success'
                });
            } else {
                return res.status(404).json({ message: 'Nenhuma escola encontrada com os IDs fornecidos' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Houve um erro no servidor!'
            });
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

    async getLogoSchool (req, res) {

        const {idSchool} = req.body;

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
    
    async getSchoolYear (req, res) {

        const {idSchool} = req.body;

        try {
            const school = await User.findById({
                _id: idSchool
            })

           // console.log()

            if (school) {
                return res.json({
                    data: school.schoolYear,
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
    
    async updateSchoolYear(req, res) {
        const { idSchool, newSchoolYear } = req.body;
      
        try {
          const updatedSchool = await User.findByIdAndUpdate(
            idSchool,
            { $set: { schoolYear: newSchoolYear } },
            { new: true }
          );
      
          if (updatedSchool) {
            return res.json({
              data: updatedSchool.schoolYear,
              message: 'Ano letivo atualizado com sucesso!'
            });
          } else {
            return res.status(404).json({
              message: 'Escola não encontrada!'
            });
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({
            message: 'Houve um erro no servidor!'
          });
        }
      }
      
}
  
module.exports = new SchoolController();