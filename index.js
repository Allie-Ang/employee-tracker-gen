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
  db.query("SELECT * FROM role", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

menu();
