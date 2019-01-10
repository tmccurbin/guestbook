var mysql = require('mysql');
var credentials = require('./credentials');

var db = mysql.createConnection({
  // Properties
  host: credentials.dbHost,
  user: credentials.dbUser,
  password: credentials.dbPassword,
  database: credentials.database
});

var connectToDatabase = function() {
  db.connect(err => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully connected to database');
    }
  });
}; // connectToDatabase

module.exports = {
  connectToDatabase: connectToDatabase,
  db: db
};