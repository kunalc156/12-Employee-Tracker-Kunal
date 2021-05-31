const mysql = require('mysql');
const inquirer = require('inquirer')

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
    runEmployeeSystem();
})

const runEmployeeSystem = () => {
    
}