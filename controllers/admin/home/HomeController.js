const auth = require("../../../middlewares/Auth");

const router = require("express").Router();


router.get("/", auth, (req, res)=>{
    res.render("pages/admin/index",{titlePage: "Dashboard"});
})


module.exports = router;