const mysql = require('mysql2');

// connect to database
module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2qD%Ac4Bt',
  database: 'employees',
});
