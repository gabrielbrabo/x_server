const schedule = require('node-schedule');
const I_stQuarter = require('../models/I_stQuarter'); // Modelo relacionado aos bimestres
const II_ndQuarter = require('../models/II_ndQuarter'); // Modelo relacionado aos bimestres
const III_rdQuarter = require('../models/III_rdQuarter'); // Modelo relacionado aos bimestres
const IV_thQuarter = require('../models/IV_thQuarter'); // Modelo relacionado aos bimestres
//const FinalConcepts = require('./models/FinalConcepts'); // Caso precise atualizar FinalConcepts
//const mongoose = require('mongoose');

// Agendamento de tarefa
const scheduleBimesterUpdates = () => {
    // Configurar a tarefa para rodar diariamente às 00:00
    schedule.scheduleJob('0 0 * * *', async () => {
        const today = new Date();
        const year = new Date().getFullYear();

        try {
            console.log(`[${new Date().toISOString()}] Iniciando verificação de bimestres...`);

            // Atualizar bimestres cujo fim já passou

            const i_st_quarter = await I_stQuarter.find({ year: year });

            const i_idsToUpdate = []; // Array para armazenar os IDs dos documentos que precisam ser atualizados

            const i_endDate = await Promise.all(
                i_st_quarter.map(async (res) => {
                    const i_endDate = new Date(res.endyear, res.endmonth - 1, res.endday);
                    if (i_endDate < today) {
                        const id = res._id;
                        console.log("id", id);
                        if (res.status != 'fechado') {
                            // Adiciona o ID ao array para futuras atualizações
                            i_idsToUpdate.push(id);
                        }
                    }
                    return i_endDate;
                })
            );
            console.log("idsToUpdate", i_idsToUpdate)
            // Verifica se existem IDs para atualizar
            if (i_idsToUpdate.length > 0) {
                // Atualiza os documentos com os IDs coletados
                const result = await I_stQuarter.updateMany(
                    { _id: { $in: i_idsToUpdate } }, // Passa todos os IDs encontrados no array
                    {
                        $set: {
                            status: 'fechado',
                            statusSupervisor: 'fechado'
                        }
                    }
                );

                console.log("Resultado da atualização:", result);
            } else {
                console.log("Nenhum documento foi encontrado para atualização.");
            }
            
            console.log("endDate", i_endDate)
            console.log("today", today)

            
            const ii_nd_quarter = await II_ndQuarter.find({ year: year });

            const ii_idsToUpdate = []; // Array para armazenar os IDs dos documentos que precisam ser atualizados

            const ii_endDate = await Promise.all(
                ii_nd_quarter.map(async (res) => {
                    const ii_endDate = new Date(res.endyear, res.endmonth - 1, res.endday);
                    if (ii_endDate < today) {
                        const id = res._id;
                        console.log("id", id);
                        if (res.status != 'fechado') {
                            // Adiciona o ID ao array para futuras atualizações
                            ii_idsToUpdate.push(id);
                        }
                    }
                    return ii_endDate;
                })
            );
            console.log("ii_idsToUpdate", ii_idsToUpdate)
            // Verifica se existem IDs para atualizar
            if (ii_idsToUpdate.length > 0) {
                // Atualiza os documentos com os IDs coletados
                const result = await II_ndQuarter.updateMany(
                    { _id: { $in: ii_idsToUpdate } }, // Passa todos os IDs encontrados no array
                    {
                        $set: {
                            status: 'fechado',
                            statusSupervisor: 'fechado'
                        }
                    }
                );

                console.log("Resultado da atualização:", result);
            } else {
                console.log("Nenhum documento foi encontrado para atualização.");
            }
            
            console.log("ii_endDate", ii_endDate)
            console.log("today", today)

            
            const iii_rd_quarter = await III_rdQuarter.find({ year: year });

            const iii_idsToUpdate = []; // Array para armazenar os IDs dos documentos que precisam ser atualizados

            const iii_endDate = await Promise.all(
                iii_rd_quarter.map(async (res) => {
                    const iii_endDate = new Date(res.endyear, res.endmonth - 1, res.endday);
                    if (iii_endDate < today) {
                        const id = res._id;
                        console.log("id", id);
                        if (res.status != 'fechado') {
                            // Adiciona o ID ao array para futuras atualizações
                            iii_idsToUpdate.push(id);
                        }
                    }
                    return iii_endDate;
                })
            );
            console.log("iii_idsToUpdate", iii_idsToUpdate)
            // Verifica se existem IDs para atualizar
            if (iii_idsToUpdate.length > 0) {
                // Atualiza os documentos com os IDs coletados
                const result = await III_rdQuarter.updateMany(
                    { _id: { $in: iii_idsToUpdate } }, // Passa todos os IDs encontrados no array
                    {
                        $set: {
                            status: 'fechado',
                            statusSupervisor: 'fechado'
                        }
                    }
                );

                console.log("Resultado da atualização:", result);
            } else {
                console.log("Nenhum documento foi encontrado para atualização.");
            }
            
            console.log("iii_endDate", iii_endDate)
            console.log("today", today)

            
            const iv_th_quarter = await IV_thQuarter.find({ year: year });

            const iv_idsToUpdate = []; // Array para armazenar os IDs dos documentos que precisam ser atualizados

            const iv_endDate = await Promise.all(
                iv_th_quarter.map(async (res) => {
                    const iv_endDate = new Date(res.endyear, res.endmonth - 1, res.endday);
                    if (iv_endDate < today) {
                        const id = res._id;
                        console.log("id", id);
                        if (res.status != 'fechado') {
                            // Adiciona o ID ao array para futuras atualizações
                            iv_idsToUpdate.push(id);
                        }
                    }
                    return iv_endDate;
                })
            );
            console.log("iv_idsToUpdate", iv_idsToUpdate)
            // Verifica se existem IDs para atualizar
            if (iv_idsToUpdate.length > 0) {
                // Atualiza os documentos com os IDs coletados
                const result = await IV_thQuarter.updateMany(
                    { _id: { $in: iv_idsToUpdate } }, // Passa todos os IDs encontrados no array
                    {
                        $set: {
                            status: 'fechado',
                            statusSupervisor: 'fechado'
                        }
                    }
                );

                console.log("Resultado da atualização:", result);
            } else {
                console.log("Nenhum documento foi encontrado para atualização.");
            }
            
            console.log("iv_endDate", iv_endDate)
            console.log("today", today)

            console.log(`[${new Date().toISOString()}]`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Erro ao executar a tarefa agendada:`, error);
        }
    });

    console.log("Tarefa agendada: Atualizações automáticas para bimestres configuradas.");
};

module.exports = scheduleBimesterUpdates;
