const config = "";

try {
  const config = require("./config.js");
  module.exports = database(config.db_host.HOST, config.db_host.PORT, config.db_host.USER, config.db_host.PASSWORD, config.db_host.DATABASE)
}
catch (e) {
  module.exports = database(process.env.DBHOST, process.env.DBPORT, process.env.DBUSER, process.env.DBPASSWORD, process.env.DBDATABASE)
}

function database(host, port, user, password, database) {
  return {
    client: 'mysql',
    connection: {
      host,
      port,
      user,
      password,
      database
    }
  }
}
