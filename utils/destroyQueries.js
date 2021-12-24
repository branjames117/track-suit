const db = require('../db/connection');
const chalk = require('chalk');

const highlight = chalk.keyword('magenta');

// DELETE DEPARTMENT
async function department(id) {
  const sql = `delete from departments where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Department Deleted from Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

// DELETE ROLE
async function role(id) {
  const sql = `delete from roles where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Role Deleted from Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

// DELETE EMPLOYEE
async function employee(id) {
  const sql = `delete from employees where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Employee Deleted from Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

module.exports = { department, role, employee };
