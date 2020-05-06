const Sequelize = require('sequelize');
const { MYSQL_CONFIG } = require("./../config/db")


const { host, user, password, port, database } = MYSQL_CONFIG

// const sequelize = new Sequelize()
const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize