const IndividualForm = require("../models/IndividualForm")
const Student = require( "../models/Student")

class GradeController {

    async createIndividualForm(req, res) {
        const { year, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_vThQuarter, id_viThQuarter, id_student, id_teacher, description, id_class } = req.body;

        // validations
        if (!year) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!description) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }
        if (!id_student) {
            return res.status(422).json({ msg: "O RE do estudante é obrigatório!" });
        }

        const form = new IndividualForm({
            year: year,
            id_iStQuarter,
            id_iiNdQuarter,
            id_iiiRdQuarter,
            id_ivThQuarter,
            id_vThQuarter,
            id_viThQuarter,
            description: description,
            id_student: id_student,
            id_teacher: id_teacher,
            id_class: id_class
        });

        try {
            
            const Form = await form.save()
            
            await Student.updateOne({
                _id: id_student
            }, {
                $push: {
                    id_individualForm: Form._id      
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

    async IndexIndividualForm(req, res) {
        const { year, id_class, id_iStQuarter, id_iiNdQuarter, id_iiiRdQuarter, id_ivThQuarter, id_vThQuarter, id_viThQuarter } = req.body;
        console.log('dados do front', req.body)
        // Cria um objeto de filtro inicial vazio
        const filter = {};
    
        // Adiciona condições ao filtro de acordo com os IDs de bimestres recebidos
        if (id_iStQuarter) filter.id_iStQuarter = id_iStQuarter;
        if (id_iiNdQuarter) filter.id_iiNdQuarter = id_iiNdQuarter;
        if (id_iiiRdQuarter) filter.id_iiiRdQuarter = id_iiiRdQuarter;
        if (id_ivThQuarter) filter.id_ivThQuarter = id_ivThQuarter;
        if (id_vThQuarter) filter.id_vThQuarter = id_vThQuarter;
        if (id_viThQuarter) filter.id_viThQuarter = id_viThQuarter;
    
        try {
            // Realiza a busca com o filtro construído
            const form = await IndividualForm.find(filter)
                .populate('id_student')
                .populate('id_teacher')
                .populate('id_class')
    
            // Filtra os resultados pela `year` e `id_class`
            const Form = form.map(res => {
                if(res.year == year) {
                    if(res.id_class._id == id_class) {
                        return res
                    }
                }
            });
            //console.log("form", form)
            //console.log("Form", Form)
            if (Form.length > 0) {
                return res.json({
                    data: Form,
                    message: 'Success'
                });
            } else {
                return res.json({
                    data: [],
                    message: 'No records found'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }

    async GetIndividualForm(req, res) {
        const { id } = req.params;
        console.log("form01", id);
        try {
            // Busca o formulário específico com o ID e popula os dados relacionados
            const form = await IndividualForm.findById(id)
                .populate('id_student')
                .populate('id_teacher')
                .populate('id_iStQuarter')
                .populate('id_iiNdQuarter')
                .populate('id_iiiRdQuarter')
                .populate('id_ivThQuarter')
                .populate('id_vThQuarter')
                .populate('id_viThQuarter');
    
            console.log("form", form);
    
            // Verifica se o formulário foi encontrado
            if (form) {
                return res.json({
                    data: form,
                    message: 'Success'
                });
            } else {
                return res.status(404).json({
                    message: 'Form not found'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'There was an error on the server side!'
            });
        }
    }    

    async update(req, res) {
        try {
            const { update_idForm, editedDescription } = req.body;
    
            // Verifique se o ID está presente
            if (!update_idForm) {
                return res.status(400).json({ message: 'ID da ficha individual não fornecido' });
            }
    
            // Encontre e atualize o documento
            const form = await IndividualForm.findByIdAndUpdate(
                update_idForm,
                { description: editedDescription },
                { new: true }
            );
    
            if (!form) {
                return res.status(404).json({ message: 'Ficha individual não encontrada' });
            }
    
            res.json(form);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ocorreu um erro no servidor' });
        }
    }
}

module.exports = new GradeController();