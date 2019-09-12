const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const router = require('./routes');
const mysql = require('mysql');
const cors = require('cors');
const dbi = require('./dbi');


const app = express();

app.use(cors());
app.use(router);

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined',{ stream: accessLogStream }));

app.listen(3000, () => {
    console.log('You dawgs... now listening to port 3000 from server');
});

app.get('/getpersons', (req,res) => {
    dbi.getAllPersons()
    .then(dbiReturn => {
        console.log("Get all persons response from db: " + dbiReturn);

        if (!dbiReturn[0]) {
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.json(dbiReturn[1]);
        }
    
        else {
            console.log('DB connection failed. \n Error : '
            + JSON.stringify(dbiReturn[0]));
            res.sendStatus(500);
        }; 
    })

    /*
    const mysqlConnectionPool = mysql.createPool({
        connectionLimit : 100,
        host : 'localhost',
        user : 'mvp',
        password : 'mvppass',
        database : 'mvp',
        debug : false
    })
    mysqlConnectionPool.query('SELECT * FROM persoane', (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.json(rows);
        }
        else {
            console.log('DB connection failed. \n Error : '
            + JSON.stringify(err));
            res.sendStatus(500);
            return;
        }
    })    
    */
})

