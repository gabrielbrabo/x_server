const I_stQuarter = require("../models/I_stQuarter")
const II_ndQuarter = require("../models/II_ndQuarter")
const III_rdQuarter = require("../models/III_rdQuarter")
const IV_thQuarter = require("../models/IV_thQuarter")
const V_thQuarter = require("../models/V_thQuarter")
const VI_thQuarter = require("../models/VI_thQuarter")
const School = require("../models/School")
const Class = require("../models/Class")

class BimonthlyController {

    async createI_stQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        /*if (!totalGrade) {
            return res.status(422).json({ msg: "A nota total é obrigatório!" });
        }

        if (!averageGrade) {
            return res.status(422).json({ msg: "A media é obrigatória!" });
        }*/

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }


        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
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
            bimonthly: '1º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
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
                msg: '1º período cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }
    async createI_stQuarter$$grade(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, totalGrade, averageGrade, id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        /*if (!totalGrade) {
            return res.status(422).json({ msg: "A nota total é obrigatório!" });
        }

        if (!averageGrade) {
            return res.status(422).json({ msg: "A media é obrigatória!" });
        }*/

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }


        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
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
            bimonthly: '1º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
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
                msg: '1º período cadastrado com sucesso.'
            })

        } catch (err) {
            res.status(500).json({
                msg: 'Error ao cadastra uma Conta profissional.'
            })
        }
    }

    async indexI_stQuarter(req, res) {

        const { year, id_school } = req.body;

        console.log()

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

    async getI_stQuarterById(req, res) {
        try {
            const i_stQuarter = await I_stQuarter.findById(req.params.id);
            console.log("i_stQuarter", i_stQuarter)
            if (!i_stQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(i_stQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateI_stQuarter(req, res) {
        try {
            const { id } = req.params;
            const {
                startday,
                startmonth,
                endday,
                endmonth,
                totalGrade,
                averageGrade,
                schoolDays,
                assessmentRegime
            } = req.body;

            const i_stQuarter = await I_stQuarter.findByIdAndUpdate(
                id,
                {
                    startday,
                    startmonth,
                    endday,
                    endmonth,
                    totalGrade,
                    averageGrade,
                    schoolDays,
                    assessmentRegime // 👈 AGORA ATUALIZA
                },
                { new: true }
            );

            if (!i_stQuarter) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }

            res.json(i_stQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createII_ndQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await I_stQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const firstQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const secondQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (secondQuarterStartDate <= firstQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 2º bimestre deve ser maior que a data de término do 1º bimestre!" });
            }
        }

        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await II_ndQuarter.find({ id_school: id_school })

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

        const bimonthly = new II_ndQuarter({
            year: year,
            bimonthly: '2º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const ii_ndQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_iiNdQuarter: ii_ndQuarter._id
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

    async createII_ndQuarter$$grade(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, totalGrade, averageGrade, id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await I_stQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const firstQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const secondQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (secondQuarterStartDate <= firstQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 2º bimestre deve ser maior que a data de término do 1º bimestre!" });
            }
        }

        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await II_ndQuarter.find({ id_school: id_school })

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

        const bimonthly = new II_ndQuarter({
            year: year,
            bimonthly: '2º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const ii_ndQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_iiNdQuarter: ii_ndQuarter._id
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

    async indexII_ndQuarter(req, res) {

        const { year, id_school } = req.body;

        const ii_NdQuarter = await II_ndQuarter.find({ id_school: id_school });
        const result = ii_NdQuarter.map(res => {
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

    async getII_ndQuarterById(req, res) {
        try {
            const ii_ndQuarter = await II_ndQuarter.findById(req.params.id);
            console.log("ii_ndQuarter", ii_ndQuarter)
            if (!ii_ndQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(ii_ndQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateII_ndQuarter(req, res) {
        try {
            const { id } = req.params;
            const {
                startday,
                startmonth,
                endday,
                endmonth,
                totalGrade,
                averageGrade,
                schoolDays,
                assessmentRegime
            } = req.body;

            const ii_ndQuarter = await II_ndQuarter.findByIdAndUpdate(id,
                {
                    startday,
                    startmonth,
                    endday,
                    endmonth,
                    totalGrade,
                    averageGrade,
                    schoolDays,
                    assessmentRegime // 👈 AGORA ATUALIZA
                },
                { new: true }
            );

            if (!ii_ndQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(ii_ndQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createIII_rdQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await II_ndQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const secondQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const thirdQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (thirdQuarterStartDate <= secondQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 3º bimestre deve ser maior que a data de término do 2º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await III_rdQuarter.find({ id_school: id_school })

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

        const bimonthly = new III_rdQuarter({
            year: year,
            bimonthly: '3º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const iii_rdQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_iii_rdQuarter: iii_rdQuarter._id
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
    async createIII_rdQuarter$$grade(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, totalGrade, averageGrade, id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await II_ndQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const secondQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const thirdQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (thirdQuarterStartDate <= secondQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 3º bimestre deve ser maior que a data de término do 2º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await III_rdQuarter.find({ id_school: id_school })

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

        const bimonthly = new III_rdQuarter({
            year: year,
            bimonthly: '3º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const iii_rdQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_iii_rdQuarter: iii_rdQuarter._id
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

    async indexIII_rdQuarter(req, res) {

        const { year, id_school } = req.body;

        const iii_rdQuarter = await III_rdQuarter.find({ id_school: id_school });
        const result = iii_rdQuarter.map(res => {
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

    async getIII_rdQuarterById(req, res) {
        try {
            const iii_rdQuarter = await III_rdQuarter.findById(req.params.id);
            console.log("ii_ndQuarter", iii_rdQuarter)
            if (!iii_rdQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iii_rdQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateIII_rdQuarter(req, res) {
        try {
            const { id } = req.params;
            const {
                startday,
                startmonth,
                endday,
                endmonth,
                totalGrade,
                averageGrade,
                schoolDays,
                assessmentRegime
            } = req.body;
            const iii_rdQuarter = await III_rdQuarter.findByIdAndUpdate(
                id,
                {
                    startday,
                    startmonth,
                    endday,
                    endmonth,
                    totalGrade,
                    averageGrade,
                    schoolDays,
                    assessmentRegime // 👈 AGORA ATUALIZA
                },
                { new: true }
            );

            if (!iii_rdQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.json(iii_rdQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createIV_thQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await III_rdQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const thirdQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const fourthQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (fourthQuarterStartDate <= thirdQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 4º bimestre deve ser maior que a data de término do 3º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await IV_thQuarter.find({ id_school: id_school })

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

        const bimonthly = new IV_thQuarter({
            year: year,
            bimonthly: '4º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const iv_thQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_ivThQuarter: iv_thQuarter._id
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
    async createIV_thQuarter$$grade(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, totalGrade, averageGrade, id_school, assessmentRegime, schoolDays } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        if (!schoolDays || !Array.isArray(schoolDays) || schoolDays.length === 0) {
            return res.status(422).json({
                msg: "É obrigatório informar os dias letivos do período."
            });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await III_rdQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const thirdQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const fourthQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (fourthQuarterStartDate <= thirdQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 4º bimestre deve ser maior que a data de término do 3º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await IV_thQuarter.find({ id_school: id_school })

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

        const bimonthly = new IV_thQuarter({
            year: year,
            bimonthly: '4º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            schoolDays: schoolDays,
            totalGrade: totalGrade,
            averageGrade: averageGrade,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school,
            assessmentRegime: assessmentRegime
        });

        try {

            const iv_thQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_ivThQuarter: iv_thQuarter._id
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

    async indexIV_thQuarter(req, res) {

        const { year, id_school } = req.body;

        const iv_thQuarter = await IV_thQuarter.find({ id_school: id_school });
        const result = iv_thQuarter.map(res => {
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

    async getIV_thQuarterById(req, res) {
        try {
            const iv_thQuarter = await IV_thQuarter.findById(req.params.id);
            console.log("ii_ndQuarter", iv_thQuarter)
            if (!iv_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iv_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateIV_thQuarter(req, res) {
        try {
            const { id } = req.params;
            const {
                startday,
                startmonth,
                endday,
                endmonth,
                totalGrade,
                averageGrade,
                schoolDays,
                assessmentRegime
            } = req.body;
            const iv_thQuarter = await IV_thQuarter.findByIdAndUpdate(id,
                {
                    startday,
                    startmonth,
                    endday,
                    endmonth,
                    totalGrade,
                    averageGrade,
                    schoolDays,
                    assessmentRegime // 👈 AGORA ATUALIZA
                },
                { new: true }
            );

            if (!iv_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            
            res.json(iv_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createV_thQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await IV_thQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const thirdQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const fourthQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (fourthQuarterStartDate <= thirdQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 5º bimestre deve ser maior que a data de término do 4º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await V_thQuarter.find({ id_school: id_school })

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

        const bimonthly = new V_thQuarter({
            year: year,
            bimonthly: '5º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            status: 'aberto',
            statusSupervisor: 'aberto',
            id_school: id_school
        });

        try {

            const v_thQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_ivThQuarter: v_thQuarter._id
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

    async indexV_thQuarter(req, res) {

        const { year, id_school } = req.body;

        const v_thQuarter = await V_thQuarter.find({ id_school: id_school });

        const result = v_thQuarter.map(res => {
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

    async getV_thQuarterById(req, res) {
        try {
            const v_thQuarter = await V_thQuarter.findById(req.params.id);
            console.log("ii_ndQuarter", v_thQuarter)
            if (!v_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(v_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateV_thQuarter(req, res) {
        try {
            const { id } = req.params;
            const v_thQuarter = await V_thQuarter.findByIdAndUpdate(id, req.body, { new: true });
            if (!v_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(v_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async createVI_thQuarter(req, res) {
        const { year, startday, startmonth, startyear, endday, endmonth, endyear, /*totalGrade, averageGrade,*/ id_school } = req.body;

        // validations
        if (!startday) {
            return res.status(422).json({ msg: "A data de incio é obrigatório!" });
        }

        if (!endday) {
            return res.status(422).json({ msg: "A data do fim é obrigatório!" });
        }

        const startDate = new Date(startyear, startmonth - 1, startday); // Note que os meses no objeto Date são baseados em zero (0 para Janeiro, 11 para Dezembro)
        const endDate = new Date(endyear, endmonth - 1, endday);

        if (endDate <= startDate) {
            return res.status(422).json({ msg: "A data de fim deve ser posterior à data de início!" });
        }

        const previousQuarter = await V_thQuarter.findOne({ id_school: id_school, year: year });

        if (previousQuarter) {
            const thirdQuarterEndDate = new Date(previousQuarter.endyear, previousQuarter.endmonth - 1, previousQuarter.endday);
            const fourthQuarterStartDate = new Date(startyear, startmonth - 1, startday);

            if (fourthQuarterStartDate <= thirdQuarterEndDate) {
                return res.status(422).json({ msg: "A data de início do 6º bimestre deve ser maior que a data de término do 5º bimestre!" });
            }
        }


        //const school = await School.findOne({ _id: id_school });

        const existingBimonthly = await VI_thQuarter.find({ id_school: id_school })

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

        const bimonthly = new VI_thQuarter({
            year: year,
            bimonthly: '6º BIMESTRE',
            startday: startday,
            startmonth: startmonth,
            startyear: startyear,
            endday: endday,
            endmonth: endmonth,
            endyear: endyear,
            //totalGrade: totalGrade,
            //averageGrade: averageGrade,
            id_school: id_school
        });

        try {

            const vi_thQuarter = await bimonthly.save()

            await School.updateOne({
                _id: id_school
            }, {
                $push: {
                    id_viThQuarter: vi_thQuarter._id
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

    async indexVI_thQuarter(req, res) {

        const { year, id_school } = req.body;

        const vi_thQuarter = await VI_thQuarter.find({ id_school: id_school });

        const result = vi_thQuarter.map(res => {
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

    async getVI_thQuarterById(req, res) {
        try {
            const vi_thQuarter = await VI_thQuarter.findById(req.params.id);
            console.log("ii_ndQuarter", vi_thQuarter)
            if (!vi_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(vi_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateVI_thQuarter(req, res) {
        try {
            const { id } = req.params;
            const vi_thQuarter = await VI_thQuarter.findByIdAndUpdate(id, req.body, { new: true });
            if (!vi_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(vi_thQuarter);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async reopenI_stQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const i_stQuarter = await I_stQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'aberto' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!i_stQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(i_stQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async tocloseI_stQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const i_stQuarter = await I_stQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'fechado' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!i_stQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(i_stQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async reopenII_ndQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const ii_ndQuarter = await II_ndQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'aberto' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!ii_ndQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(ii_ndQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async tocloseII_ndQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const ii_ndQuarter = await II_ndQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'fechado' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!ii_ndQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(ii_ndQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async reopenIII_rdQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const iii_rdQuarter = await III_rdQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'aberto' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!iii_rdQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iii_rdQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async tocloseIII_rdQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const iii_rdQuarter = await III_rdQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'fechado' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!iii_rdQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iii_rdQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async reopenIV_thQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const iv_thQuarter = await IV_thQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'aberto' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!iv_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iv_thQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async tocloseIV_thQuarter(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o ID foi fornecido
            if (!id || id === "undefined") {
                return res.status(400).json({ error: "ID is required and cannot be 'undefined'" });
            }
            const iv_thQuarter = await IV_thQuarter.findByIdAndUpdate(
                id, // Passa todos os IDs encontrados no array
                {
                    $set: {
                        statusSupervisor: 'fechado' // Atualização do campo
                    }
                },
                { new: true } // Retorna o documento atualizado
            );
            if (!iv_thQuarter) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(iv_thQuarter); // Retorna o documento atualizado
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async closeBimesterDiary(req, res) {
        try {
            const { idClass, bimester, field } = req.body;

            if (!idClass || !bimester || !field) {
                return res.status(400).json({ msg: "Campos obrigatórios ausentes." });
            }

            const updatePath = `dailyStatus.${bimester}.${field}`;

            const result = await Class.updateOne(
                { _id: idClass },
                { $set: { [updatePath]: "fechado" } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ msg: "Turma não encontrada ou já atualizada." });
            }

            return res.status(200).json({
                msg: `Status '${field}' do '${bimester}' fechado com sucesso.`
            });
        } catch (error) {
            console.error("Erro ao fechar status do diário:", error);
            return res.status(500).json({ msg: "Erro interno do servidor." });
        }
    };
    async reOpenBimesterDiary(req, res) {
        try {
            const { idClass, bimester, field } = req.body;

            if (!idClass || !bimester || !field) {
                return res.status(400).json({ msg: "Campos obrigatórios ausentes." });
            }

            const updatePath = `dailyStatus.${bimester}.${field}`;

            const result = await Class.updateOne(
                { _id: idClass },
                { $set: { [updatePath]: "aberto" } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ msg: "Turma não encontrada ou já atualizada." });
            }

            return res.status(200).json({
                msg: `Status '${field}' do '${bimester}' fechado com sucesso.`
            });
        } catch (error) {
            console.error("Erro ao fechar status do diário:", error);
            return res.status(500).json({ msg: "Erro interno do servidor." });
        }
    };
}

module.exports = new BimonthlyController();