# Track Suit

## Employee Tracking with MySQL

## Description

A command-line application that accepts user input with Inquirer

When the application is started, the following options are presented:

- view all departments
  `select * from departments;`

- view all roles
  `select roles.title, roles.id, departments.name as department_name, roles.salary from roles left join departments on roles.department_id = departments.id;`

- view all employees
  `select a.id, a.first_name, a.last_name, roles.title, roles.salary, departments.name as department, concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id left join roles on a.role_id = roles.id left join departments on roles.department_id = departments.id;`

- view employees by manager (bonus)
  `select distinct concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id;`

- view employees by department (bonus)
  `select id from roles where department_id = 1` to get roles in that department, then send that result to `select * from employees where role_id in (1, 2);`

- view total utilized budget per department (bonus)

- add a department
- delete a department (bonus)
- add a role
- delete a role (bonus)
- add an employee
- delete an employee (bonus)
- update an employee role
- update an employee's manager (bonus)

When choosing to view all departments, a formatted table is presented showing the department names and ids.

When choosing to view all roles, a formatted table shows job title, role id, and the department the role belongs to, and the salary for that role.

When choosing to view all employees, a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.

When choosing to add a department, then prompt for the name of the department and add that department to the database.

When choosing to add a role, enter the name, salary, and department for the role and add that role to the database.

When choosing to add an employee, enter the employee’s first name, last name, role, and manager, and that employee is added to the database.

When updating an employee role, select an employee and update their new role and update this information in the database.

## Schema

Schema should contain the following three tables:

- department
  - id: int primary key
  - name: varchar(30)
- role
  - id: int primary key
  - title: varchar(30)
  - salary: decimal
  - department_id: int
- employee
  - id: int primary key
  - first_name: varchar(30)
  - last_name: varchar(30)
  - role_id: int
  - manager_id: int
