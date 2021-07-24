const mysql = require('mysql');
const inquirer = require('inquirer');

let deptArr= []

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
              'Add a Department',
              'Add a Role',
              'Add An Employee',
              'Remove An Employee',
              'Update Employee Role',
              'Update Employee Manager',
            ],
        }
    ]);
    loadDepartments()
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

        if(userChoice == "Add a Department"){
          addDept()
        }

        if(userChoice == "Add a Role"){
          addRole()
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

const loadDepartments = () => {
  deptArr = [];
  connection.query(`SELECT * from department`, (err, data) => {
    if(err) throw err;
    // console.log(data)
    data.forEach(index => deptArr.push(index.name))
  })
}

const addDept= () => {
  inquirer.prompt([
    {
      message: 'What is the name of the new Department?',
      name: 'deptName'
    }
  ]).then(async ({deptName}) => {
    await connection.query(`
    INSERT INTO department(name)
    VALUES(?)`,
    [deptName],
    err => {
      if(err) throw err
    })
  })
}


const addRole = () => {
  inquirer.prompt([
    {
      message: 'What is the name of the new Role?',
      name: 'roleName'
    },
    {
      message: 'What is the salary for this new Role?',
      name: 'roleSalary'
    },
    {
      type: 'list',
      choices: deptArr,
      name: 'deptChoice',
      message: 'What department does this new role belong to?'
    }
  ]).then(answer => {
    console.log(answer)
    let actualSqlId = deptArr.indexOf(answer.deptChoice) + 1;
    //use an asynchronous function to get the actual sql ID without cheating, yes.
    connection.query(`INSERT INTO role (title, salary, department_id) 
    VALUES (?, ?, ?)`, 
    [answer.roleName, answer.roleSalary, actualSqlId], 
    err => {
      if(err) throw err;
    })
  })
}



