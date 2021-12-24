const db = require('../db/connection');
const cTable = require('console.table');
const chalk = require('chalk');

const highlight = chalk.keyword('magenta');

// PRINT ALL DEPARTMENTS TO TABLE
async function departments() {
  const sql = `SELECT * FROM departments`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
Viewing All ${highlight('DEPARTMENTS')}
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
      console.table(rows);
    })
    .catch(console.log);
}

// PRINT ALL ROLES TO TABLE
async function roles() {
  const sql = `SELECT roles.title, roles.id, departments.name as department, concat('$', format(roles.salary,0)) as salary from roles left join departments on roles.department_id = departments.id`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
Viewing All ${highlight('ROLES')}
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
      console.table(rows);
    })
    .catch(console.log);
}

// PRINT ALL EMPLOYEES TO TABLE
async function employees() {
  const sql = `select a.id, a.first_name, a.last_name, roles.title, concat('$', format(roles.salary, 0)) as salary, departments.name as department, concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id left join roles on a.role_id = roles.id left join departments on roles.department_id = departments.id`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`

------------------------------
Viewing All ${highlight('EMPLOYEES')}
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
      console.table(rows);
    })
    .catch(console.log);
}

// PRINT ALL EMPLOYEES BY MANAGER TO TABLE
function employeesByManager(manager_id) {
  const sql = `select concat(b.first_name, ' ', b.last_name) as manager, a.first_name, a.last_name, a.id, roles.title, concat('$', format(roles.salary, 0)) as salary, departments.name as department from employees a left join employees b on a.manager_id = b.id left join roles on a.role_id = roles.id left join departments on roles.department_id = departments.id where b.id = ?;`;
  const params = manager_id;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`

------------------------------
Viewing All Employees by ${highlight('MANAGER')}
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    console.table(rows);
  });
}

// PRINT ALL EMPLOYEES BY DEPARTMENT TO TABLE
function employeesByDepartment(department_id) {
  const sql = `select departments.name as department, employees.* from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id where role_id in (select id from roles where department_id = ?) `;
  const params = department_id;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`

------------------------------
Viewing All Employees by ${highlight('DEPARTMENT')}
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    console.table(rows);
  });
}

// PRINT TOTAL UTILIZED BUDGET PER DEPARTMENT TO TABLE
function totalUtilizedBudget() {
  const sql = `select departments.name as department, concat('$', format(sum(roles.salary), 0)) as 'total utilized budget' from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id group by departments.name`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`

------------------------------
Viewing ${highlight('TOTAL UTILIZED BUDGET')} per Department
Press UP or DOWN to return to the Main Menu.
------------------------------
`);
    console.table(rows);
  });
}

module.exports = {
  departments,
  roles,
  employees,
  employeesByManager,
  employeesByDepartment,
  totalUtilizedBudget,
};
