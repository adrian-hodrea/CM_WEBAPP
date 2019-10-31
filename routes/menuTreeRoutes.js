const router = require("express").Router();
const createConnectionPool = require('./dbConnectionPool.js'); 
const arrayToTree = require('array-to-tree');


router.get('/', (req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    const menuQuery = 

    `SELECT menu.execrun AS "id", exec.title AS "name", menu.exec AS "parent_id", exec.type AS "type"
    FROM menu INNER JOIN exec ON menu.execrun = exec.exec`;
    mysqlConnectionPool.query(menuQuery, (err, rows, fields) => {
        if (!err) {
            rows.forEach((element, index, sir) => {
              if(element.parent_id == 0) {
                  sir[index].parent_id = null;
              }  
            });
            var treeMenuData = arrayToTree(rows);
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.json(treeMenuData);
        }
        else {
            console.log('DB connection failed. \n Error : '
            + JSON.stringify(err));
            res.sendStatus(500);
            return;
        }
    })      
})

module.exports = router; 
