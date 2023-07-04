require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const body = require("body-parser");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const connection = require("../core/Model");
connection.authenticate().then(()=>{console.log("Conexão feita com sucesso.")}).catch((err)=>{console.log("Erro na conexão", err)})


app.use(session({
    secret:"flashlog",
    saveUninitialized: true,
    resave: true
}));

app.use(flash());
app.use(express.static("public"));
app.use(body.urlencoded({extended: false}));
app.use(body.json());

app.set("view engine", "ejs")

  
io.on("connection", (socket)=>{
    console.log("Novo cliente conectado");
    socket.on("disconnect", ()=>{
        console.log("Cliente desconectado");
    })
})

http.listen(process.env.PORT, (err)=>{
    if(err != null){
        console.log("O servidor não está rodando");
    }else{
        console.log("O servidor está rodando")
    }
})

module.exports = {app, io};