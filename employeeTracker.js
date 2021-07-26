const mysql = require('mysql');
const inquirer = require('inquirer');

let deptArr = []

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_trackerDB',
});

connection.connect(async (err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  runTracker();
});


const runTracker = async() => {
  try {
    const {userOption} =  await inquirer.prompt(
        {
            name: 'userOption',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
              'View all employees',
              'View all departments',
              'View all roles',
              'View all employees by department',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update employee role',
              'Exit'
            ],
        }); 
        loadDepartments() 
    usersAnswer(userOption);
   
  } catch (e) {
      console.log(e);
  }
}

const usersAnswer = (userOption) => {
  switch (userOption) {
    case 'View all employees':
      viewAllEmployees();
      break;
    case 'View all departments':
      viewDepartments();
      break;
    case 'View all roles':
      viewRoles();
      break;
    case 'View all employees by department':
      viewByDepartment();
      break;
    case "Add a department":
      addDept()
      break;
    case "Add a role":
      addRole()
      break;
    case "Add an employee":
      addEmployee()
      break;
    case "Update employee role":
      updateEmployeeRole()
      break;
   case "Exit":
     connection.end();
     console.log('Good Bye!');
     break;
    }
  }

//Function to load all departments
const loadDepartments = () => {
  deptArr = [];
  connection.query(`SELECT * from department`, (err, data) => {
    if(err) throw err;
    // console.log(data)
    data.forEach(index => deptArr.push(index.name))
  })
}

//Function to grab DATA to view in Table
const myCallBack = function(err, data) {
  console.table(data)
  runTracker();
}


//View all employees, departments and roles
const viewAllEmployees = async() => {
    try{
         await connection.query('SELECT * FROM employee', myCallBack );
        
    }catch(err){
        console.log(err);
    }
    }

const viewDepartments = async() => {
  try{
    await connection.query('SELECT * FROM department', myCallBack );
   
}catch(err){
   console.log(err);
}
}

const viewRoles = async() => {
  try{
    await connection.query('SELECT * FROM role', myCallBack );
   
}catch(err){
   console.log(err);
}
}

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




function addDept() {
  inquirer.prompt([

      {
          type: 'input',
          name: 'department',
          message: 'What is the new department name:'
      }

  ]).then(answer => {
      console.log(answer);
      connection.query('INSERT INTO department SET?', { name: answer.department }, (err, res) => {
          if (err) throw err;
          console.log('Added new department')
          runTracker();
      });
  });
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
    runTracker();
  })
}

async function addEmployee() {
  connection.query('SELECT * FROM role', function(err, result) {
      if (err) throw (err);
  inquirer
      .prompt([{
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        }, 
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "roleName",
          type: "list",
          message: "What is this employee's role?",
          choices: function() {
           rolesArr = [];
              result.forEach(result => {
                  rolesArr.push(
                      result.title
                  );
              })
              return rolesArr;
            }
        }
        ]) 
      .then(function(answer) {
      console.log(answer);
      const role = answer.roleName;
      connection.query('SELECT * FROM role', function(err, res) {
          if (err) throw (err);
          let resultsR = res.filter(function(res) {
              return res.title == role;
          })
      let roleId = resultsR[0].id;
      connection.query("SELECT * FROM employee", function(err, res) {
              inquirer
              .prompt ([
                  {
                      name: "manager",
                      type: "list",
                      message: "Who is their manager?",
                      choices: function() {
                          managersArr = []
                          res.forEach(res => {
                              managersArr.push(
                                  res.last_name)
                              
                          })
                          return managersArr;
                      }
                  }
              ]).then(function(usersAnswer) {
                  const manager = usersAnswer.manager;
              connection.query('SELECT * FROM employee', function(err, res) {
              if (err) throw (err);
              let resultsM = res.filter(function(res) {
              return res.last_name == manager;
          })
          let managerId = resultsM[0].id;
                  console.log(usersAnswer);
                  let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                  let values = [answer.firstName, answer.lastName, roleId, managerId]
                  console.log(values);
                   connection.query(query, values,
                       function() {
                       console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                      })
                      viewAllEmployees();
                      })
                   })
              })
          })
      })
})
}

function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', function(err, result) {
      if (err) throw (err);
  inquirer .prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Which employee's role is changing?",
          choices: function() {
           employeeArr = [];
              result.forEach(result => {
                  employeeArr.push(
                      result.first_name
                  );
              })
              return employeeArr;
            }
        }
        ]) 
      .then(function(answer) {
      console.log(answer);
      const name = answer.employeeName;
      connection.query("SELECT * FROM role", function(err, res) {
              inquirer
              .prompt ([
                  {
                      name: "role",
                      type: "list",
                      message: "What is their new role?",
                      choices: function() {
                          rolesArr = [];
                          res.forEach(res => {
                              rolesArr.push(
                                  res.title)
                              
                          })
                          return rolesArr;
                      }
                  }
              ]).then(function(newRole) {
                  const role = newRole.role;
                  console.log(newRole.role);
              connection.query('SELECT * FROM role WHERE title = ?', [role], function(err, res) {
              if (err) throw (err);
                  let roleId = res[0].id;
                  let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                  let values = [roleId, name]
                  console.log(values);
                   connection.query(query, values,
                       function(err, res) {
                       console.log(`You have updated ${name}'s role to ${role}.`)
                      })
                      viewAllEmployees();
                      })
                   })
              })
     })
})
}
