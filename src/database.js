const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dataBase = process.env.dataBase;

const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPassword}@escolarx.7ebaqd0.mongodb.net/${dataBase}?retryWrites=true&w=majority`;

async function connectWithRetry() {
    try {
        await mongoose.connect(MONGODB_URI, {
            //maxPoolSize: 50, // tamanho do pool de conexões
            serverSelectionTimeoutMS: 10000, // tempo máx para encontrar um servidor
            socketTimeoutMS: 60000,          // tempo máx de inatividade da conexão
        });
        console.log("🟢 Conectado ao MongoDB com sucesso");
    } catch (err) {
        console.error("🔴 Erro ao conectar no MongoDB:", err.message);
        console.log("⏳ Tentando reconectar em 5 segundos...");
        setTimeout(connectWithRetry, 5000);
    }
}

// Monitoramento da conexão
mongoose.connection.on('disconnected', () => {
    console.log('🔌 Conexão com MongoDB perdida. Tentando reconectar...');
    connectWithRetry();
});

module.exports = connectWithRetry;
