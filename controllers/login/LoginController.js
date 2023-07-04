require("dotenv").config();
const express = require("express");
const session = require("express-session");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const Tokens = require("csrf");
const {SendEmail} = require("../../classes/SendEmail");
const UsersModel = require("../../models/Users");
const secret = new Tokens().secretSync();
let token = new Tokens().create(secret);
const bcrypt = require("bcryptjs");

router.get("/", (req, res)=>{
    req.session.token = token;
    res.render("login", {titlePage: "Acesso restrito", token, email:req.flash("email"), success:req.flash("success"), error:req.flash("error")});
})

router.post("/logar", 
[
    check('email').notEmpty().isEmail().trim().escape(),
    check('password').notEmpty().trim().escape(),
    check('token').notEmpty().trim().escape(),
]
, async (req, res)=>{
    const errors = validationResult(req);

    if(req.session.TENTATIVAS > 3){
        req.flash("error", "Foram realizadas três tentativas de login. Por favor, espere 10 minutos para tentar novamente.")
        res.redirect(process.env.BASE_URL);
        return;
    }
    if(!errors.isEmpty()){
        req.flash("error", "Verifique os campos e tente novamente.")
        res.redirect(process.env.BASE_URL);
        return;
    }
    const {email, password, token} = req.body;
    if(req.session.token !== token){
        req.flash("error", "Verifique os dados informados e tente novamente.");
        res.redirect(process.env.BASE_URL);
        return;
    }
    let user = await UsersModel.find({email})
    if(!user.error){
        if(user.data.user.emailVerified == 1){
            const correct = bcrypt.compareSync(password, user.data.user.password)
            if(correct){
                req.session.SESSION_LOGIN = {
                    id: user.data.user.id,
                    name: user.data.user.name,
                    email: user.data.user.email,
                }
                res.redirect(process.env.BASE_URL+"admin/")
                return;
            }else{
                req.flash("error", "Verifique os dados informados e tente novamente.");
                res.redirect(process.env.BASE_URL);
                return
            }
        }else{
            req.flash("error", "Antes de realizar o login é preciso verificar seu e-mail.");
            res.redirect(process.env.BASE_URL);
            return
        }
    }else{
        req.flash("error", "Os dados informados não foram encontrandos no nosso banco de dados.");
        res.redirect(process.env.BASE_URL);
        return;
    }
})


module.exports = router;