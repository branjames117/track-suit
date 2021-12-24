# Track Suit

## Employee Tracking with MySQL

## Description

A command-line application that accepts user input with Inquirer

When the application is started, the following options are presented:

- view all departments
  `select * from departments;`

- view all roles
  `select roles.title, roles.id, departments.name as department_name, concat('$', format(roles.salary, 0)) as salary from roles left join departments on roles.department_id = departments.id;`

- view all employees
  `select a.id, a.first_name, a.last_name, roles.title, concat('$', format(roles.salary, 0)) as salary, departments.name as department, concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id left join roles on a.role_id = roles.id left join departments on roles.department_id = departments.id;`

- view employees by manager (bonus)
  `select distinct concat(b.first_name, ' ', b.last_name) as manager from employees a left join employees b on a.manager_id = b.id;`

- view employees by department (bonus)
  `select * from employees where role_id in (select id from roles where department_id = 1);`

- view total utilized budget per department (bonus)
  `select departments.name as department, concat('$', format(sum(roles.salary), 0)) as 'total utilized budget' from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id group by departments.name;`

- add a department
  `insert into departments(department_name) values ('International Subterfuge')`
- delete a department (bonus)
  `delete from departments where id = 1`
- add a role
  `insert into roles(title, salary, department_id) values ('Runner', 50000, 1)`
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
