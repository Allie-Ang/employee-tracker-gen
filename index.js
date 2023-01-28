const inquirer = require("inquirer");
const db = require("./db/connection");
require("console.table");

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employees role",
          "quit",
        ],
      },
    ])
    .then((response) => {
      let { choice } = response;
      if (choice === "view all departments") {
        viewDeparments();
      } else if (choice === "view all roles") {
        viewRoles();
      } else if (choice === "view all employees") {
        viewEmployees();
      } else if (choice === "add a department") {
        addDepartment();
      } else if (choice === "add a role") {
        addRole();
      } else if (choice === "add an employee") {
        addEmployee();
      } else if (choice === "update an employees role") {
        updateEmployeeRole();
      } else {
        process.exit();
      }
    });
}

function viewDeparments() {
  db.query("SELECT * FROM department", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

function viewRoles() {
  db.query(
    "SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      menu();
    }
  );
}

function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
                    AS "last name", role.title, department.name AS department, role.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "department",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.department],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Department Added");
          menu();
        }
      );
    });
}

function updateEmployeeRole() {
  db.query(
    "SELECT employee.first_name, employee.last_name, employee.id FROM employee",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      let employees = result.map(({ id, first_name, last_name }) => ({
        value: id,
        name: `${first_name} ${last_name}`,
      }));
      db.query("SELECT * FROM role", (err, result) => {
        if (err) {
          console.log(err);
        }
        let roles = result.map(({ id, title }) => ({
          value: id,
          name: title,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee would you like to update?",
              name: "employeeName",
              choices: employees,
            },
            {
              type: "list",
              message: "What is the employees new role?",
              name: "employeeRole",
              choices: roles,
            },
          ])
          .then((answers) => {
            console.log(answers);
            db.query(
              "UPDATE employee SET role_id = ? WHERE id = ?",
              [answers.employeeRole, answers.employeeName],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("Employee Role Updated");
                menu();
              }
            );
          });
      });
    }
  );
}

menu();
