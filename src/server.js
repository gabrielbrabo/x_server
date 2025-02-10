const express = require('express')
const app = express()
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require('cors')
const path = require("path");
const scheduleBimesterUpdates = require('./middlewares/schedule'); // Importa o agendamento

require("dotenv").config();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(require("./routes"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(cors({
  origin: 'http://localhost:3000',  // Onde o frontend está rodando
}));

// Iniciar o agendamento
scheduleBimesterUpdates();

//user e password de acesso ao banco de dados
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dataBase = process.env.dataBase;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@escolarx.7ebaqd0.mongodb.net/${dataBase}?retryWrites=true&w=majority`,
    //{ useNewUrlParser: true },
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen( process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));