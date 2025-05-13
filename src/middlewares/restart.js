// middlewares/schedule.js
const cron = require('node-cron');
const reinicializarServidor = require('../utils/reinicializarServidor');

function scheduleBimesterUpdates() {
  cron.schedule('0 3 * * *', async () => {
    console.log("⏰ Executando tarefa agendada às 03:00");
    await reinicializarServidor();
  });
}

module.exports = scheduleBimesterUpdates;
