const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employee_trackerDB',
});

connection.connect(async (err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  try {
    const userChoice1 = await inquirer.prompt([
        {
            name: 'userOption',
            type: 'list',
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
        }
    ]);
    doWhatUserWantsTodo(userChoice1.userOption);
  } catch (e) {
      console.log(e);
  }
});

const doWhatUserWantsTodo = async (userChoice) => {

        if (userChoice === 'View All Employees') {
          viewAllEmployees();
        }

        // if (userChoice === 'View All Employees By Department') {
        //   viewByDepartment();
        // }

        // if (userChoice === 'View All Employees By Manager') {
        //   viewByManager();
        // }

        // if (userChoice === 'Add An Employee') {
        //   addEmployee();
        // }

        // if (userChoice === 'Remove An Employee') {
        //   removeEmployee();
        // }

        //     if (userChoice === 'Update Employee Role') {
        //   newRole();
        // }

        //  if (userChoice === 'Update Employee Manager') {
        //    newManager();
        //  }    
      };


const viewAllEmployees = async() => {
    try{
        const employee = await connection.query('SELECT * FROM employee');
        console.table(employee)
    }catch(err){
        console.log(err);
    }
    }



