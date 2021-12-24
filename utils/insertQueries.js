const db = require('../db/connection');

async function department(name) {
  const sql = `insert into departments(name) values (?)`;
  const params = name;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
${name} Added to Database
------------------------------`);
    })
    .catch(console.log);
}

async function role(title, salary, department_id) {
  const sql = `insert into roles(title, salary, department_id) values (?, ?, ?)`;
  const params = [title, salary, department_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
${title} Added to Database
------------------------------`);
    })
    .catch(console.log);
}

async function employee(first_name, last_name, role_id, manager_id) {
  const sql = `insert into employees(first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)`;
  const params = [first_name, last_name, role_id, manager_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
${first_name} ${last_name} Added to Database
------------------------------`);
    })
    .catch(console.log);
}

module.exports = { department, role, employee };
