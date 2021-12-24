const db = require('../db/connection');
const cTable = require('console.table');

// print all departments
async function departments() {
  const sql = `SELECT * FROM departments`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Viewing All Departments
------------------------------`);
      console.table(rows);
    })
    .catch(console.log);
}

// print all roles
async function roles() {
  const sql = `SELECT roles.title, roles.id, departments.name as department, concat('$', format(roles.salary,0)) as salary from roles left join departments on roles.department_id = departments.id`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Viewing All Roles
------------------------------`);
      console.table(rows);
    })
    .catch(console.log);
}

// print all employees
async function employees() {
  const sql = `select a.id, a.first_name, a.last_name, roles.title, concat('$', format(roles.salary, 0)) as salary, departments.name as department, concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id left join roles on a.role_id = roles.id left join departments on roles.department_id = departments.id`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(`
------------------------------
Viewing All Employees
------------------------------`);
      console.table(rows);
    })
    .catch(console.log);
}

// print all employees by manager id
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
Viewing All Employees by One Manager
------------------------------`);
    console.table(rows);
  });
}

// print all employees by department id
function employeesByDepartment(department_id) {
  const sql = `select departments.name as department, employees.* from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id where role_id in (select id from roles where department_id = ?) `;
  const params = department_id;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Viewing All Employees in One Department:');
    console.table(rows);
  });
}

// print total utilized budget per department
function totalUtilizedBudget() {
  const sql = `select departments.name as department, concat('$', format(sum(roles.salary), 0)) as 'total utilized budget' from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id group by departments.name`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Viewing Total Utilized Budget per Department:');
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
