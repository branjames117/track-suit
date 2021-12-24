const db = require('../db/connection');
const capitalize = require('./capitalize');
const chalk = require('chalk');

const highlight = chalk.keyword('magenta');

async function byColumn(col_name, employee_id, role_id) {
  const sql = `update employees set ${col_name + '_id'} = ? where id = ?`;
  const params = [role_id, employee_id];
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} Employee ${capitalize(col_name)} Altered
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

module.exports = { byColumn };
