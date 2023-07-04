const {Sequelize} = require("sequelize");

const connection = new Sequelize(process.env.DBNAME, process.env.USER_DB, process.env.PASS_DB,{
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
});


module.exports = connection;
