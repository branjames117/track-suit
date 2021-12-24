const db = require('../db/connection');
const chalk = require('chalk');

const highlight = chalk.keyword('magenta');

// INSERT NEW DEPARTMENT
async function department(name) {
  const sql = `insert into departments(name) values (?)`;
  const params = name;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Department Added to Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

// INSERT NEW ROLE
async function role(title, salary, department_id) {
  const sql = `insert into roles(title, salary, department_id) values (?, ?, ?)`;
  const params = [title, salary, department_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Role Added to Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

// INSERT NEW EMPLOYEE
async function employee(first_name, last_name, role_id, manager_id) {
  const sql = `insert into employees(first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)`;
  const params = [first_name, last_name, role_id, manager_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
Employee Added to Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

module.exports = { department, role, employee };
