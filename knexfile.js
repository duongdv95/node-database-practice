const config = require("./config.js");

module.exports = {
  client: 'mysql',
  connection: {
    host: config.db_host.HOST || process.env.DBHOST,
    port: config.db_host.PORT || process.env.DBPORT,
    user: config.db_host.USER || process.env.DBUSER,
    password: config.db_host.PASSWORD || process.env.DBPASSWORD,
    database: config.db_host.DATABASE  || process.env.DBDATABASE
  }
}