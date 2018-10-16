const config = null;
try {
  const config = require("./config.js");
} catch(e) {

}

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.DBHOST || config.db_host.HOST,
    port: process.env.DBPORT || config.db_host.PORT,
    user: process.env.DBUSER || config.db_host.USER,
    password: process.env.DBPASSWORD || config.db_host.PASSWORD,
    database: process.env.DBDATABASE || config.db_host.DATABASE
  }
}