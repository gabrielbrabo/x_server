const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");
const http = require("http"); // necessário para capturar as conexões
const scheduleBimesterUpdates = require('./middlewares/schedule');
const connectWithRetry = require("./database");

require("dotenv").config();

const server = http.createServer(app);

// 🔒 Monitoramento de conexões e logins
let activeConnections = new Set();
let loginCountToday = 0;

// Zera o contador de login à meia-noite
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    loginCountToday = 0;
  }
}, 60 * 1000); // verifica a cada minuto

server.on('connection', (socket) => {
  activeConnections.add(socket);
  console.log(`🟢 Conectado. Online: ${activeConnections.size}`);

  socket.on('close', () => {
    activeConnections.delete(socket);
    console.log(`🔴 Desconectado. Online: ${activeConnections.size}`);
  });
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(require("./routes"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(cors({
  origin: 'http://localhost:3000',
}));

// ✅ Rota para status do sistema
app.get("/status", (req, res) => {
  res.json({
    pessoasOnline: activeConnections.size,
    loginsHoje: loginCountToday,
  });
});

scheduleBimesterUpdates();

// 🚀 Inicialização
connectWithRetry().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 5000}`);
  });
});

