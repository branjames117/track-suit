const db = require('../db/connection');

// these are functions to return various formatted lists for menu choices

// GET LIST OF MANAGERS
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

  return rowsArr.map((manager) => `${manager.id}: ${manager['manager name']}`);
}

// GET LIST OF DEPARTMENTS
async function departments() {
  const sql = `select * from departments`;

  let rowsArr = [];

  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      rowsArr = rows;
    })
    .catch(console.log);

  return rowsArr.map((department) => `${department.id}: ${department.name}`);
}

// GET LIST OF ROLES BY DEPARTMENT
async function rolesByDepartment(department_id) {
  const sql = `select roles.id, roles.title from roles left join departments on roles.department_id = departments.id where departments.id = ?`;
  const params = department_id;

  let rowsArr = [];

  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      rowsArr = rows;
    })
    .catch(console.log);

  return rowsArr.map((role) => `${role.id}: ${role.title}`);
}

// GET LIST OF EMPLOYEES BY DEPARTMENT
async function employeesByDepartment(department_id) {
  const sql = `select employees.id, concat(employees.first_name, ' ', employees.last_name) as name from employees left join roles on roles.id = employees.role_id left join departments on roles.department_id = departments.id where departments.id = ?`;
  const params = department_id;

  let rowsArr = [];

  await db
    .promise()
    .query(sql, params)
    .then(([rows, fields]) => {
      rowsArr = rows;
    })
    .catch(console.log);

  return rowsArr.map((employee) => `${employee.id}: ${employee.name}`);
}

module.exports = {
  managers,
  departments,
  rolesByDepartment,
  employeesByDepartment,
};
