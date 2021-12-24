const db = require('../db/connection');

async function department(id) {
  const sql = `delete from departments where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Department Deleted from Database
------------------------------`);
    })
    .catch(console.log);
}

async function role(id) {
  const sql = `delete from roles where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Role Deleted from Database
------------------------------`);
    })
    .catch(console.log);
}

async function employee(id) {
  const sql = `delete from employees where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Employee Deleted from Database
------------------------------`);
    })
    .catch(console.log);
}

module.exports = { department, role, employee };
