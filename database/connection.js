const mysql = require('mysql2');

const database = "movies_app";
var mySqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: database,
    multipleStatements: true
});

mySqlConnection.connect((err) => {
    if(!err){
        console.log(`Connected to database: ${database}`);
    }
    else {
        console.log(`Connection failed to database ${database}`);
        console.log(err)
    }
});

module.exports = mySqlConnection;