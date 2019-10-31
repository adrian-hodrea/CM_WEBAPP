var mysql = require('mysql');
const createConnectionPool = () => {
    return mysql.createPool({
        connectionLimit : 100,
        host : 'localhost',
        user : 'mvp',
        password : 'mvppass',
        database : 'mvp',
        debug : false,
        timezone : 'Z',
        dateStrings : 'true'
    })
}

module.exports= createConnectionPool;