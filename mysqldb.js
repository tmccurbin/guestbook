var mysql = require('mysql');
var dotenv = require('dotenv')

// Configure environment variables
dotenv.config()

var db_config = {
  // Properties
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
}

var connection;

var connectToDatabase = function() {

  connection = mysql.createConnection(db_config);

  module.exports.connection = connection // Set this value after defining variable, otherwise undefined

  connection.connect(err => {
    if (err) {
      console.error(err);
      setTimeout(connectToDatabase, 2000); // Try to reconnect
    } else {
      console.log('Successfully connected to database');
    }
  });

  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      connectToDatabase();                         // lost due to either server restart, or a
    } else {
     console.log('error is err:', err);                                      // connnection idle timeout (the wait_timeout
     // throw err;                                  // server variable configures this)
    }
  });

}; // connectToDatabase

module.exports.connectToDatabase = connectToDatabase