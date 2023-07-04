require("dotenv").config();
const nodemailer = require("nodemailer");

class SendEmail{
    #transporter;
    constructor({mailTo, mailSubject, mailMessage, mailHTML}){
        this.mailTo = mailTo;
        this.mailMessage = mailMessage;
        this.mailHTML = mailHTML;
        this.mailSubject = mailSubject;
        this.#transporter = nodemailer.createTransport({
            host: process.env.HOST_MAIL,
            service: process.env.SERVICE_MAIL,
            secure: process.env.SECURE_MAIL,
            auth:{
                user: process.env.USER_MAIL,
                pass: process.env.PASS_MAIL
            }
        })
    }
    sendMail(){
        let data = {
            from: process.env.USER_MAIL,
            to: this.mailTo,
            subject: this.mailSubject,
            text: this.mailMessage,
            html: this.mailHTML,
        }
        this.#transporter.sendMail(data,(err)=>{
            if(err){
                return {error: true, data: {message: 'E-mail de confirmação não enviado',err}}
            }
            return {error:false, data:{message:'E-mail de confirmação enviado.'}}
        })
        return {error:false, data:{message:'E-mail de confirmação enviado.'}}
    }
}

module.exports = {SendEmail}