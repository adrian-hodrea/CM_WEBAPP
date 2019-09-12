const mysql = require('mysql');

const mysqlConnectionPool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'mvp',
    password : 'mvppass',
    database : 'mvp',
    debug : false
});


module.exports.getAllPersons = () => {
    return new Promise((resolve, reject) => {
        mysqlConnectionPool.query('SELECT * FROM persoane', (err, rows, fields) => {
            console.log("Rows from DB: " + JSON.stringify(rows));
            console.log("Err from DB: " + err);
    
            return [err, rows, fields];
        }) 
    
    }) 
};

