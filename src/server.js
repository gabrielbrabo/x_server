const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const path = require("path");
const scheduleBimesterUpdates = require('./middlewares/schedule');
const connectWithRetry = require("./database"); // <-- aqui

require("dotenv").config();

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

scheduleBimesterUpdates();

// inicia a conexão com reconector automático
connectWithRetry().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 5000}`);
  });
});
