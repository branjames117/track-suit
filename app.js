const inquirer = require('inquirer');
const chalk = require('chalk');
const print = require('./utils/printQueries');
const insert = require('./utils/insertQueries');
const get = require('./utils/getListItems');

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
          const departments = await get.departments();
          promptDepartmentMenu(departments);
          break;
        case 'View Total Utilized Budget per Department':
          print.totalUtilizedBudget();
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
  console.log(departments);
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

promptMainMenu();
// print.departments();
// print.roles();
// print.employees();
// print.managers();
// print.employeesByManager(1);
// print.employeesByDepartment(1);
// print.totalUtilizedBudget();
