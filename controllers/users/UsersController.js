const connection = require("../../core/Model");
const router = require("express").Router();
const {check, validationResult} = require("express-validator")
const session = require("express-session");
const UsersModel = require("../../models/Users");


router.post("/users/create",
[
check('email').notEmpty().isEmail().trim().escape(),
check('name').notEmpty().isLength({min:3}).trim().escape(),
check('lastname').notEmpty().isLength({min:3}).trim().escape(),
check('password').notEmpty().isLength({min:6}).trim().escape(),
check('token').notEmpty().trim().escape()
], async (req, res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    req.flash("error", 'Verifique os dados informados e tente novamente. O nome e sobrenome devem possuir no mínimo 3 caracteres. A senha deve possuir no mínimo 6 caracteres.');
    res.redirect("/");
    return;
   }
   const user = await UsersModel.create(req.body);
   if(user.error){
    req.flash("error", user.data.message)
    res.redirect("/");
    return;
   }else{
    req.flash("success", user.data.message)
    res.redirect("/");
    return;
   }
})

router.post("/users/update",[
    check('email').optional().isEmail().trim().escape(),
    check('name').optional().isLength({min:3}).trim().escape(),
    check('lastname').optional().isLength({min:3}).trim().escape(),
    check('password').optional().isLength({min:6}).trim().escape(),
    check('emailVerified').notEmpty().isInt().trim().escape(),
    check('token').optional().trim().escape()
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     req.flash("error", 'Verifique os dados informados e tente novamente. O nome e sobrenome devem possuir no mínimo 3 caracteres. A senha deve possuir no mínimo 6 caracteres.');
     res.redirect("/");
     return;
    }

    const user = await UsersModel.update(req.body);
    if(user.error){
            req.flash("error", user.data.message)
            res.redirect("/");
            return;
    }else{
            req.flash("success", user.data.message)
            res.redirect("/");
            return;
    }
})



module.exports = router;