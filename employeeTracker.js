const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 8001,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employee_trackerDB',
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer.prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Add An Employee',
        'Remove An Employee',
        'Update Employee Role',
        'Update Employee Manager',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'View All Employees By Department':
          viewByDepartment();
          break;

        case 'View All Employees By Manager':
          viewByManager();
          break;

        case 'Add An Employee':
          addEmployee();
          break;

        case 'Remove An Employee':
          removeEmployee();
          break;

        case 'Update Employee Role':
          newRole();
          break;

         case 'Update Employee Manager':
           newManager();
           break;

        default:
          console.log(`Invalid action`);
          break;
      }
    });
};

const viewAllEmployees = async() => {
    try{
        const employee = await connection.query('SELECT * FROM employee');
        console.table(employee);
        runSearch()
    }catch(err){
        console.log(err)
    }
    }



