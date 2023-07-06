/*
    Este trecho de código é uma definição de classe chamada SendEmail, que é usada 
    para enviar e-mails usando o módulo Nodemailer. Vamos analisar o código em detalhes:
*/

// A primeira linha faz uso do dotenv para carregar as variáveis de ambiente de um arquivo .env.
require("dotenv").config();
// O módulo nodemailer é importado na segunda linha.
const nodemailer = require("nodemailer");

/*
  Em seguida, temos a definição da classe SendEmail. A classe possui um atributo privado chamado 
  #transporter, que é inicializado no construtor da classe usando o método createTransport do Nodemailer. 
  Esse método cria um objeto transporter que será usado para enviar e-mails. 
*/
class SendEmail{
    /** O construtor da classe SendEmail recebe um objeto com as propriedades mailTo, mailSubject, mailMessage 
    * e mailHTML. Essas propriedades são usadas para configurar os detalhes do e-mail que será enviado.
    * @var #transporter: nodemailer Transport
    * @var mailTo: string
    * @var mailSubject: string
    * @var mailMessage: string
    * @var mailHTML: string
    */
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
    /*
        O método sendMail é responsável por enviar o e-mail. Ele cria um objeto data que contém as informações do e-mail, 
        como o remetente, o destinatário, o assunto, o texto e o HTML. Em seguida, o método sendMail do transporter é
        chamado para enviar o e-mail. Se ocorrer algum erro durante o envio, ele é capturado e um objeto com uma mensagem 
        de erro é retornado. Caso contrário, um objeto com uma mensagem de sucesso é retornado.
    */
    /**
    * @returns void
    */
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

// Por fim, a classe SendEmail é exportada através do module.exports, para que possa ser utilizada em outros arquivo
module.exports = {SendEmail}
