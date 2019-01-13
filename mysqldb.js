var mysql = require('mysql');
var dotenv = require('dotenv')

// Configure environment variables
dotenv.config()

var db = mysql.createConnection({
  // Properties
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
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