const inquirer = require('inquirer');
const chalk = require('chalk');
const print = require('./utils/printQueries');
const insert = require('./utils/insertQueries');
const get = require('./utils/getListItems');
const alter = require('./utils/alterQueries');
const destroy = require('./utils/destroyQueries');

const highlight = chalk.keyword('magenta');

// greet the user
console.log(`------------------------------
${highlight('Welcome to TRACK SUIT')}

Your All-in-One Employee Management System

Let's get started
------------------------------`);

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

function promptManagerMenu(managers) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectManager',
        message: 'View employees under which manager?',
        choices: managers.map(
          (manager) => `${manager.id}: ${manager['manager name']}`
        ),
      },
    ])
    .then(({ selectManager }) => {
      const managerId = parseInt(selectManager.split(':')[0]);
      print.employeesByManager(managerId);
      promptMainMenu();
    });
}

function promptDepartmentMenu(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'selectDepartment',
        message: 'View employees under which department?',
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then(({ selectDepartment }) => {
      const departmentId = parseInt(selectDepartment.split(':')[0]);
      print.employeesByDepartment(departmentId);
      promptMainMenu();
    });
}

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
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then((role) => {
      const departmentId = parseInt(role.department.split(':')[0]);
      insert.role(role.title, role.salary, departmentId);
      promptMainMenu();
    });
}

function promptNewEmployee(departments) {
  let employee = {};
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
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then(async (answers) => {
      employee = {
        first_name: answers.first_name,
        last_name: answers.last_name,
      };
      const department_id = parseInt(answers.department_id.split(':')[0]);
      const roles = await get.rolesByDepartment(department_id);
      const possibleManagers = await get.employeesByDepartment(department_id);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'role_id',
            message: `Enter the role of the employee:`,
            choices: roles.map((role) => `${role.id}: ${role.title}`),
          },
          {
            type: 'list',
            name: 'manager_id',
            message: `Enter the name of the employee's manager:`,
            choices: [
              possibleManagers.map(
                (manager) => `${manager.id}: ${manager.name}`
              ),
              'No manager',
            ].flat(),
          },
        ])
        .then(async ({ role_id, manager_id }) => {
          employee.role_id = parseInt(role_id.split(':')[0]);
          if ((manager_id = 'No manager')) {
            employee.manager_id = null;
          } else {
            employee.manager_id = parseInt(manager_id.split(':')[0]);
          }
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

function promptAlterRole(departments) {
  let employee_id;
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
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then(async (answers) => {
      employee_id = answers.id;
      const department_id = parseInt(answers.department_id.split(':')[0]);
      const roles = await get.rolesByDepartment(department_id);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'role_id',
            message: "Enter employee's new role:",
            choices: roles.map((role) => `${role.id}: ${role.title}`),
          },
        ])
        .then(({ role_id }) => {
          alter.role(parseInt(employee_id), parseInt(role_id.split(':')[0]));
          promptMainMenu();
        });
    });
}

function promptAlterManager(departments) {
  let employee_id;
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
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then(async (answers) => {
      employee_id = answers.id;
      const department_id = parseInt(answers.department_id.split(':')[0]);
      const possibleManagers = await get.employeesByDepartment(department_id);
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'manager_id',
            message: "Select employee's new manager:",
            choices: [
              possibleManagers.map(
                (manager) => `${manager.id}: ${manager.name}`
              ),
              'No manager',
            ].flat(),
          },
        ])
        .then(({ manager_id }) => {
          alter.manager(
            parseInt(employee_id),
            parseInt(manager_id.split(':')[0])
          );
          promptMainMenu();
        });
    });
}

function promptDeleteDepartment(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department to delete:',
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
      },
    ])
    .then((answers) => {
      const departmentId = parseInt(answers.department_id.split(':')[0]);
      destroy.department(departmentId);
      promptMainMenu();
    });
}

function promptDeleteRole(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department of role to be deleted:',
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
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
            choices: roles.map((role) => `${role.id}: ${role.title}`),
          },
        ])
        .then((answers) => {
          const roleId = parseInt(answers.role_id.split(':')[0]);
          destroy.role(roleId);
          promptMainMenu();
        });
    });
}

function promptDeleteEmployee(departments) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select department of employee to be deleted:',
        choices: departments.map(
          (department) => `${department.id}: ${department.name}`
        ),
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
            choices: employees.map(
              (employee) => `${employee.id}: ${employee.name}`
            ),
          },
        ])
        .then((answers) => {
          const employeeId = parseInt(answers.employee_id.split(':')[0]);
          destroy.employee(employeeId);
          promptMainMenu();
        });
    });
}

promptMainMenu();
