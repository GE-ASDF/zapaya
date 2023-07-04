const LoginController = require("./controllers/login/LoginController");
const UsersController = require("./controllers/users/UsersController");
const HomeAdminController = require("./controllers/admin/home/HomeController");
const { app } = require("./src/app");

app.use("/", LoginController);
app.use("/", UsersController);
app.use("/admin", HomeAdminController);
app.use((req, res, next) => {
    req.flash("error", "Página não encontrada.");
    res.redirect("back");
    // res.status(404).render('404', {error:req.flash("error"), goTo: "..", success:req.flash("error"), titlePage: 'Página não encontrada'}); // Renderiza a página '404.ejs'
});