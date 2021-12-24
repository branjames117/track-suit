const db = require('../db/connection');

async function role(employee_id, role_id) {
  const sql = `update employees set role_id = ? where id = ?`;
  const params = [role_id, employee_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Employee Role Altered
------------------------------`);
    })
    .catch(console.log);
}

async function manager(employee_id, manager_id) {
  const sql = `update employees set manager_id = ? where id = ?`;
  const params = [manager_id, employee_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Employee Manager Altered
------------------------------`);
    })
    .catch(console.log);
}

module.exports = { role, manager };
