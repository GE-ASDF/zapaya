require("dotenv").config();

function auth(req, res, next){
    if(req.session.SESSION_LOGIN != undefined){
        next();
    }else{
        req.flash("error", "É preciso estar logado para realizar esta ação.");
        res.redirect(process.env.BASE_URL);
        return;
    }
}

module.exports = auth;