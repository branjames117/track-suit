const db = require('../db/connection');
const chalk = require('chalk');

const highlight = chalk.keyword('magenta');

// convert string to camel case
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fromTable(target, id) {
  const sql = `delete from ${target + 's'} where id = ?`;
  const params = id;
  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
${highlight('Success!')} ${capitalize(target)} Deleted from Database
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    })
    .catch(console.log);
}

module.exports = { fromTable };
