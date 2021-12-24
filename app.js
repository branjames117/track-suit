const inquirer = require('inquirer');
const chalk = require('chalk');
const print = require('./utils/printQueries');
const insert = require('./utils/insertQueries');
const get = require('./utils/getListItems');
const alter = require('./utils/alterQueries');
const destroy = require('./utils/destroyQueries');

const highlight = chalk.keyword('magenta');

// GREET THE USER
console.log(`------------------------------
${highlight('Welcome to TRACK SUIT')}

Your All-in-One Employee Management System

Let's get started
------------------------------`);

// DISPLAY THE MAIN MENU
function promptMainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectMain',
        message: 'Select an option.',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'View Employees by Manager',
          'View Employees by Department',
          'View Total Utilized Budget per Department',
          'Add a Department',
          'Add a Role',
          'Add an Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'Delete a Department',
          'Delete a Role',
          'Delete an Employee',
        ],
      },
    ])
    .then(async ({ selectMain }) => {
      // fetch all current departments as this data is useful throughout the rest of the prompts
      const departments = await get.departments();

      switch (selectMain) {
        case 'View All Departments':
          print.departments();
          promptMainMenu();
          break;
        case 'View All Roles':
          print.roles();
          promptMainMenu();
          break;
        case 'View All Employees':
          print.employees();
          promptMainMenu();
          break;
        case 'View Employees by Manager':
          const managers = await get.managers();
          promptManagerMenu(managers);
          break;
        case 'View Employees by Department':
          promptDepartmentMenu(departments);
          break;
        case 'View Total Utilized Budget per Department':
          print.totalUtilizedBudget();
          promptMainMenu();
          break;
        case 'Add a Department':
          promptNewDepartment();
          break;
        case 'Add a Role':
          promptNewRole(departments);
          break;
        case 'Add an Employee':
          promptNewEmployee(departments);
          break;
        case 'Update Employee Role':
          promptAlterRole(departments);
          break;
        case 'Update Employee Manager':
          promptAlterManager(departments);
          break;
        case 'Delete a Department':
          promptDeleteDepartment(departments);
          break;
        case 'Delete a Role':
          promptDeleteRole(departments);
          break;
        case 'Delete an Employee':
          promptDeleteEmployee(departments);
          break;
      }
    });
}

// VIEW EMPLOYEES BY MANAGER MENU
function promptManagerMenu(managers) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectManager',
        message: 'View employees under which manager?',
        choices: managers,
      },
    ])
    .then(({ selectManager }) => {
      const managerId = parseInt(selectManager.split(':')[0]);
      print.employeesByManager(managerId);

      promptMainMenu();
    });
}

// VIEW EMPLOYEES BY DEPARTMENT MENU
function promptDepartmentMenu(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectDepartment',
        message: 'View employees under which department?',
        choices: departments,
      },
    ])
    .then(({ selectDepartment }) => {
      const departmentId = parseInt(selectDepartment.split(':')[0]);
      print.employeesByDepartment(departmentId);

      promptMainMenu();
    });
}

// CREATE NEW DEPARTMENT MENU
function promptNewDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate(name) {
          if (name.length <= 0) {
            return 'Department name is required.';
          } else {
            return true;
          }
        },
      },
    ])
    .then((department) => {
      insert.department(department.name);

      promptMainMenu();
    });
}

// CREATE NEW ROLE MENU
function promptNewRole(departments) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
        validate(title) {
          if (title.length <= 0) {
            return 'Role title is required.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: `Enter the role's salary:`,
        validate(salary) {
          if (isNaN(salary) || salary <= 0) {
            return 'Salary must be an integer.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'list',
        name: 'department',
        message: `Enter the department the role belongs to:`,
        choices: departments,
      },
    ])
    .then(({ title, salary, department }) => {
      const departmentId = parseInt(department.split(':')[0]);
      insert.role(title, salary, departmentId);

      promptMainMenu();
    });
}

// CREATE NEW EMPLOYEE MENU
function promptNewEmployee(departments) {
  // begin with an empty object so we can grow it over nested inquirer prompts
  let employee = {};

  // begin first round of questions (first and last name and department)
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
        validate(first_name) {
          if (first_name.length <= 0) {
            return 'First name is required.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
        validate(last_name) {
          if (last_name.length <= 0) {
            return 'Last name is required.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'list',
        name: 'department_id',
        message: `Enter the department the employee belongs to:`,
        choices: departments,
      },
    ])
    .then(async ({ first_name, last_name, department_id }) => {
      // update employee object
      employee = {
        first_name,
        last_name,
      };

      // set data for next round of questions
      const departmentId = parseInt(department_id.split(':')[0]);
      const roles = await get.rolesByDepartment(departmentId);
      const possibleManagers = await get.employeesByDepartment(departmentId);

      // begin second round of questions
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'role_id',
            message: `Enter the role of the employee:`,
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: `Enter the name of the employee's manager:`,
            choices: [possibleManagers, 'No manager'].flat(),
          },
        ])
        .then(async ({ role_id, manager_id }) => {
          // update employee object once more
          employee.role_id = parseInt(role_id.split(':')[0]);

          employee.manager_id =
            manager_id === 'No manager'
              ? null
              : parseInt(manager_id.split(':')[0]);

          insert.employee(
            employee.first_name,
            employee.last_name,
            employee.role_id,
            employee.manager_id
          );

          promptMainMenu();
        });
    });
}

// ALTER EMPLOYEE'S ROLE MENU
function promptAlterRole(departments) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: "Enter employee's ID:",
        validate(id) {
          if (isNaN(id) || id <= 0) {
            return 'ID must be an integer.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'list',
        name: 'department_id',
        message: "Enter employee's department:",
        choices: departments,
      },
    ])
    .then(async ({ id, department_id }) => {
      const employee_id = id;
      const departmentId = parseInt(department_id.split(':')[0]);
      const roles = await get.rolesByDepartment(departmentId);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'role_id',
            message: "Enter employee's new role:",
            choices: roles,
          },
        ])
        .then(({ role_id }) => {
          alter.byColumn(
            'role',
            parseInt(employee_id),
            parseInt(role_id.split(':')[0])
          );

          promptMainMenu();
        });
    });
}

// ALTER EMPLOYEE'S MANAGER MENU
function promptAlterManager(departments) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: "Enter employee's ID:",
        validate(id) {
          if (isNaN(id) || id <= 0) {
            return 'ID must be an integer.';
          } else {
            return true;
          }
        },
      },
      {
        type: 'list',
        name: 'department_id',
        message: "Select employee's department:",
        choices: departments,
      },
    ])
    .then(async ({ id, department_id }) => {
      const employee_id = id;
      const departmentId = parseInt(department_id.split(':')[0]);
      const possibleManagers = await get.employeesByDepartment(departmentId);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'manager_id',
            message: "Select employee's new manager:",
            choices: [possibleManagers, 'No manager'].flat(),
          },
        ])
        .then(({ manager_id }) => {
          manager_id =
            manager_id === 'No manager'
              ? null
              : parseInt(manager_id.split(':')[0]);

          alter.byColumn('manager', parseInt(employee_id), manager_id);

          promptMainMenu();
        });
    });
}

// DELETE DEPARTMENT MENU
function promptDeleteDepartment(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department to delete:',
        choices: departments,
      },
    ])
    .then((answers) => {
      const departmentId = parseInt(answers.department_id.split(':')[0]);
      destroy.fromTable('department', departmentId);
      promptMainMenu();
    });
}

// DELETE ROLE MENU
function promptDeleteRole(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department of role to be deleted:',
        choices: departments,
      },
    ])
    .then(async (answers) => {
      const departmentId = parseInt(answers.department_id.split(':')[0]);
      const roles = await get.rolesByDepartment(departmentId);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'role_id',
            message: 'Select role to be deleted:',
            choices: roles,
          },
        ])
        .then((answers) => {
          const roleId = parseInt(answers.role_id.split(':')[0]);
          destroy.fromTable('role', roleId);

          promptMainMenu();
        });
    });
}

// DELETE EMPLOYEE MENU
function promptDeleteEmployee(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department of employee to be deleted:',
        choices: departments,
      },
    ])
    .then(async (answers) => {
      const departmentId = parseInt(answers.department_id.split(':')[0]);
      const employees = await get.employeesByDepartment(departmentId);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select employee to be deleted:',
            choices: employees,
          },
        ])
        .then((answers) => {
          const employeeId = parseInt(answers.employee_id.split(':')[0]);
          destroy.fromTable('employee', employeeId);

          promptMainMenu();
        });
    });
}

// BEGIN PROMPTS
promptMainMenu();
