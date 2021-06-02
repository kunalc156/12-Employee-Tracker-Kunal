const mysql = require('mysql');
const inquirer = require('inquirer')
const cTable = require('console.table');

//creating connection object
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Gr00tr00t156',
    database: 'employee_tracker_db'
});

connection.connect((err) =>{
    if(err) throw err;
    console.log(`
    ----------------------------------------------------
    ----------------------------------------------------
    `);
    runEmployeeSystem();
})

const runEmployeeSystem = () => {
    inquirer
    .prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View All Employees by department',
                'View All Employees by manager',
                'Add Employee', 
                'Add Role',
                'Add Department',
                'Update Employee Role', 
                'Exit'
            ],
    })
    .
    then(({ choice }) => {
        switch(choice){
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Employees by department':
                viewAllEmployeesByDept();
                break;
            case 'View All Employees by manager':
                viewAllEmployeesByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`action not found: ${choice}`);
        }
        console.log(
            `
            ------------------------------------------------------
                          ${choice}
            ------------------------------------------------------
            `);
    });
};

const viewAllEmployees = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as'department', CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => 
    {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);

        runEmployeeSystem();
    });  
}

const viewAllEmployeesByDept = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, d.name as'department' FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
        runEmployeeSystem();
    });
}

const viewAllEmployeesByManager = () => {
    connection.query("SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name,' ', m.last_name) as 'manager' FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN department d ON d.id = r.department_id", (err, res) => {
        if(err) throw err;

        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
        runEmployeeSystem();
    });
}

const viewRoles = () => {

    connection.query("SELECT * FROM role", (err, res) =>{
        if(err) throw err;
        console.table(res);

        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);

        runEmployeeSystem();

    });
}

const addEmployee = () => {
    let employees = [];
    let roles = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;


        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }

        connection.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                employees.push(res[i].first_name + ' ' + res[i].last_name);
            }

            inquirer
                .prompt([
                    {
                        name: 'firstName',
                        message: "What is the employee's first name?",
                        type: 'input'
                    },
                    {
                        name: 'lastName',
                        message: "What is the employee's last name?",
                        type: 'input',
                    },
                    {
                        name: 'roleId',
                        message: 'What is their role?',
                        type: 'list',
                        choices: roles,
                    },
                    {
                        name: 'managerId',
                        message: "Who is their manager?",
                        type: 'list',
                        choices: ['none'].concat(employees)
                    }
                ]).then(({ firstName, lastName, roleId, managerId }) => {
                    let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
                    if (managerId != 'none') {
                        queryText += `, manager_id) VALUES ('${firstName}', '${lastName}', ${roles.indexOf(roleId)}, ${employees.indexOf(managerId) + 1})`
                    } else {
                        queryText += `) VALUES ('${firstName}', '${lastName}', ${roles.indexOf(roleId) + 1})`
                    }

                    connection.query(queryText, (err) => {
                        if (err) throw err;

                            console.log(`
                            ----------------------------------------------------
                            ----------------------------------------------------
                            `);
                        runEmployeeSystem();
                    });
                });

        });
    });
}

const addRole = () => {

    let roles = [];
    let departments = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
        connection.query(`SELECT * FROM department`, (err, res) => {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                departments.push(res[i].name);
            }
            
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What title would you like to add?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary?'
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Which department does it belong to?',
                    choices: departments
                }
            ]).then(({ title, salary, dept }) => {
                let queryText = `INSERT INTO role (title, salary`;
                    queryText += `,  department_id) VALUES ('${title}', '${salary}', ${departments.indexOf(dept) + 1})`

                connection.query(queryText, (err) => {
                    if (err) throw err;

                console.log(`
                ----------------------------------------------------
                ----------------------------------------------------
                `);
                viewRoles();
                });
            });
        });
    });

}
/**
 * function to add department
 */
const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'dept',
            message: 'which department would you like to add?'
        })
        .then(({ dept }) => {
            if(dept != "" ){
                let queryText = `INSERT INTO department (name) VALUES ('${dept}')`;
                connection.query(queryText, (err) =>{
                    if (err) throw err;
                    viewDepartments();
                    console.log(`
                    ----------------------------------------------------
                    ----------------------------------------------------
                    `);
            
                });
            }
        });
 }
    
 /**
 * function to view departments
 */

 const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) =>{
        if(err) throw err;
        console.log(`
        ----------------------------------------------------
        ----------------------------------------------------
        `);
        console.table(res);
        runEmployeeSystem();
    });
}

/**
 * update role
 */
const updateRole = () => {
    connection.query(`SELECT * FROM employee`, function (err, res) {
        if (err) throw err;

        let employees = [];
        let roles = [];

        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].first_name + ' ' + res[i].last_name);
        }

        connection.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                roles.push(res[i].title)
            }

            inquirer
                .prompt([
                    {
                        name: 'employeeId',
                        message: "which employee's role to be updated?",
                        type: 'list',
                        choices: employees
                    },
                    {
                        name: 'roleId',
                        message: "What is the new role?",
                        type: 'list',
                        choices: roles
                    }
                ]).then(({ employeeId, roleId }) => {
                    connection.query(`UPDATE employee SET role_id = ${roles.indexOf(roleId) + 1} WHERE id = ${employees.indexOf(employeeId) + 1}`, (err) => {
                        if (err) throw err;

                        console.log(`
                        ----------------------------------------------------
                        ----------------------------------------------------
                        `);
                        runEmployeeSystem();
                    });
                });
        });

    });
}
