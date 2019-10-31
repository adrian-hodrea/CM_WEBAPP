const router = require("express").Router();
const createConnectionPool = require('./dbConnectionPool.js'); 

router.get('/', (req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const query = `SELECT * FROM cod_indemnizatie`;
    mysqlConnectionPool.query(query, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.json(rows);
        }
        else {
            console.log('DB connection failed. \n Error : '
            + JSON.stringify(err));
            res.sendStatus(500);
            return;
        }
    });
});

module.exports = router;