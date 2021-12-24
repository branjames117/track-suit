const db = require('../db/connection');

// get all managers
async function managers() {
  const sql = `select distinct b.id, concat(b.first_name, ' ', b.last_name) as 'manager name' from employees a left join employees b on a.manager_id = b.id where a.manager_id is not null`;

  let rowsArr = [];

  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      rowsArr = rows;
    })
    .catch(console.log);

  return rowsArr;
}

module.exports = { managers };
