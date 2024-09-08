const I_stQuarter = require("../models/I_stQuarter")
const School = require("../models/School")

class BimonthlyController {

    async createI_stQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, totalGrade, averageGrade, id_school } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!totalGrade) {
            return res.status(422).json({ msg: "A nota total é obrigatório!" });
        }

        if (!averageGrade) {
            return res.status(422).json({ msg: "A media é obrigatória!" });
        }

        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await I_stQuarter.find({ id_school: id_school })

        console.log("existingBimonthly", existingBimonthly)
        if (existingBimonthly) {
            const result = existingBimonthly.map(Res => {
                if (Res.year == year) {
                    return Res.year
                }
                return null
            }).filter(Res => {
                if (Res !== null) {
                    return Res
                }
            })
            console.log("result", result)
            if (result.length > 0) {
                return res.status(422).json({ msg: "O bimestre ja foi definido voçê so podera editalo!" });
            }
        }

        const bimonthly = new I_stQuarter({
            year: year,
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            id_school: id_school
        });

        try {

            const i_stQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_iStQuarter: i_stQuarter._id
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

    async indexI_stQuarter(req, res) {

        const { year, id_school } = req.body;

        const i_stQuarter = await I_stQuarter.find({ id_school: id_school });
        const result = i_stQuarter.map(res => {
            if (res.year == year) {
                return res
            }
        }).filter(res => {
            if (res != null) {
                return res
            }
        })

        try {
            if (result) {
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

module.exports = new BimonthlyController();