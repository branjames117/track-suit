# Track Suit

## Employee Tracking with MySQL

## Description

A command-line application that accepts user input with Inquirer

When the application is started, the following options are presented:

- delete a department (bonus)
  `delete from departments where id = 1`

- delete a role (bonus)
  `delete from roles where id = 1`
- add an employee
  `insert into employees(first_name, last_name, role_id, manager_id) values ('James', 'Bond', 1, NULL)`
- delete an employee (bonus)
  `delete from employees where id = 1`
- update an employee role
  `update employees set role_id = 1 where id = 1`
- update an employee's manager (bonus)
  `update employees set manager_id = 1 where id = 1`

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
