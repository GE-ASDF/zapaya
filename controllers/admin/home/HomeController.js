const getStatusClient = require("../../../helpers/getStatusClient");
const auth = require("../../../middlewares/Auth");
const { io } = require("../../../src/app");
const wppSession = require("../../../src/wppconnect");
const router = require("express").Router();

async function allChats(){
    let chats = (await wppSession).listChats({onlyUsers:true})
    return chats;
}

async function getProfilePic(chatId){
    let profilePic = (await wppSession).getProfilePicFromServer(chatId)
    return profilePic;
}

router.get("/", /*auth*/ async (req, res)=>{
    let chats =  (await allChats().then(chats => chats)).map(chat =>{
        return {
            name: chat.contact.pushname ? chat.contact.pushname:chat.id._serialized,
            number: chat.id._serialized,
        } 
    })
    io.emit("conectado");
    res.render("pages/admin/index",{titlePage: "Dashboard", chats, success:req.flash("success"), error: req.flash("error")});
})

router.post("/getProfilePic/",/*auth*/ async (req, res)=>{
    let chatId = req.body.chatId;
    let img = (await getProfilePic(chatId)).img
    res.json({
        img,
    })
    return;
})
router.post("/getMessagesById/", async(req, res)=>{
    let userId = req.body.userId;
    console.log(req.body);
    wppSession.then((client)=>{
        client.getMessages(userId, {count:-1})
        .then((messages)=>{
            res.json(messages)
            return;
        })
    })
})
module.exports = router;