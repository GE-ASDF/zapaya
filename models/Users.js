const sequelize = require("sequelize");
const connection = require("../core/Model");
const bcrypt = require("bcryptjs");
const { SendEmail } = require("../classes/SendEmail");

const Users = connection.define('users', {
    name:{
        type: sequelize.STRING,
        allowNull: false,
    },
    lastname:{
        type: sequelize.STRING,
        allowNull: false, 
    },
    email:{
        type: sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: sequelize.TEXT,
        allowNull: false,
    },
    emailVerified:{
        type: sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
    }
});

class UsersModel{
    /**
     * Este model tem como função manipular os dados do usuário no banco de dados.
     */

    // Este método cria um novo usuário já criando o hash de senha.
    static async create(userData){
        let response = await Users.findOne({where:{email: userData.email}});
        const user = response;
        if(!user){
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
            response = await Users.create(userData);
            const userCreated = response;
            if(userCreated){
                const mailSended = new SendEmail({mailTo: userData.email, mailSubject:"Confirmação de e-mail", mailMessage:"Confirme o e-mail clicando no link abaixo", mailHTML:`
                <form action='${process.env.BASE_URL}users/update' method='POST'>
                    <input type="hidden" name="email" value="${userData.email}">
                    <input type="hidden" name="emailVerified" value="1">
                    <button class="btn btn-primary">Confirmar e-mail</button>
                </form>
                `}).sendMail();
                if(!mailSended.error){
                    return {error: false, data: {message: 'Cadastro realizado com sucesso. Verifique seu e-mail para confirmação dos dados.',userCreated, mailSended}};
                }else{
                    return {error: false, data: {message: 'Cadastro realizado com sucesso, mas não foi possível enviar um e-mail para confirmação do dados cadastrados.',userCreated, mailSended}};
                }
            }else{
                return {error: true, data:{message: "Ocorreu um erro ao cadastrar no banco de dados. Verifique os dados e tente novamente."}};
            }
        }
        return {error: true, data:{message: 'Já existe um usuário com este e-mail cadastrado.'}};
    }

    static async update(userData){

        if(userData.password == undefined){
            let response = await Users.findOne({where:{email:userData.email}})
            const user = response;
            if(user){
                response = await Users.update(userData, {where:{email:userData.email}})
                const userUpdated = response;
                if(userUpdated){
                    return {error: false, data:{message:'Dados atualizados com sucesso.'}}
                }else{
                    return {error: true, data:{message:'Os dados não foram atualizados.'}}
                }
            }else{
                return {error: true, data:{message:'Nenhum usuário foi encontrado com os dados informados.'}}
            }
        }else{
            let response = await Users.findOne({where:{email:userData.email}})
            const user = response;
            if(user){
                const salt = bcrypt.genSaltSync(10);
                userData.password = bcrypt.hashSync(userData.password, salt);
                response = await Users.update(userData, {where:{email:userData.email}})
                const userUpdated = response;
                if(userUpdated){
                    return {error: false, data:{message:'Dados atualizados com sucesso.'}}
                }else{
                    return {error: true, data:{message:'Os dados não foram atualizados.'}}
                }
            }else{
                return {error: true, data:{message:'Nenhum usuário foi encontrado com os dados informados.'}}
            }
            
        }
    }

    static async find(userData){
        let response = await Users.findOne({where:{email:userData.email}}) 
        let user = response;
        if(user){
            return {error: false, data: {message: 'Usuário encontrado.', user}}
        }else{
            return {error: true, data: {message: 'Usuário não encontrado.', user}}
        }
    }
}

Users.sync({force: false});
module.exports = UsersModel;