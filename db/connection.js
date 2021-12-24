const mysql = require('mysql2');

// connect to database and export that connection for other parts of the app
module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2qD%Ac4Bt', // changed this to your own local MySQL password
  database: 'employees',
});
