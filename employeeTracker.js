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

        if (userChoice === 'View All Employees By Department') {
          viewByDepartment();
        }

        if (userChoice === 'View All Employees By Manager') {
          viewByManager();
        }

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

var myCallBack = function(err, data) {
  console.table(data)
}
/*
TODOS
  view roles
  view departments
  same function as viewAllEmployees
*/  
const viewAllEmployees = async() => {
    try{
         await connection.query('SELECT * FROM employee', myCallBack );
        
    }catch(err){
        console.log(err);
    }
    }

// bonus but not listed.
const viewByDepartment = async() => {
  try{
       await connection.query(
       `SELECT 
            department.name, employee.first_name, employee.last_name
        FROM
            employee
                JOIN
            role ON employee.role_id = role.id
                JOIN
            department ON role.department_id = department.id
        GROUP BY department.id , employee.first_name , employee.last_name;`,
        myCallBack );
      
  }catch(err){
      console.log(err);
  }
  }
// bonus
const viewByManager = async() => {
  try {
    
  } catch (error) {
    
  }
}






