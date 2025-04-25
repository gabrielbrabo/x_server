const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");
const http = require('http');
const scheduleBimesterUpdates = require('./middlewares/schedule');
const connectWithRetry = require("./database");

require("dotenv").config();

// Monitoramento de conexões
const server = http.createServer(app);
let totalConnections = 0;
let activeConnections = new Set();

server.on('connection', (socket) => {
  totalConnections++;
  activeConnections.add(socket);
  console.log(`🟢 Nova conexão. Ativas: ${activeConnections.size}, Total: ${totalConnections}`);

  socket.on('close', () => {
    activeConnections.delete(socket);
    console.log(`🔴 Conexão encerrada. Ativas: ${activeConnections.size}`);
  });
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(require("./routes"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

// Agendamento de tarefas
scheduleBimesterUpdates();

// Conexão com banco e inicialização do servidor
connectWithRetry().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 5000}`);
  });
});
