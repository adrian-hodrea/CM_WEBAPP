const express = require("express");
const router = express.Router();
const fs = require('fs');
var mysql = require('mysql');
const arrayToTree = require('array-to-tree');
const bodyparser = require('body-parser');

router.use(bodyparser.json());
router.use('/frontend', express.static('frontend'));
router.use('/assets', express.static('assets'));


router.get("/", (req,res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    var myReadStream = fs.createReadStream('./frontend/pages/index.html','utf8')
    myReadStream.pipe(res);
});

/* Routes dealing with DB */

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

router.get('/getMenuTree', (req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    const menuQuery = 

    `SELECT menu.execrun AS "id", exec.title AS "name", menu.exec AS "parent_id"
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

router.get('/getIdDocTypes', (req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const query = `SELECT * FROM citypes`;
    mysqlConnectionPool.query(query, (err, rows, fields) => {
        if (!err) {
            var docTypesObj = arrayToTree(rows);
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.json(docTypesObj);
        }
        else {
            console.log('DB connection failed. \n Error : '
            + JSON.stringify(err));
            res.sendStatus(500);
            return;
        }
    });
});

router.post("/postPersoanaNoua", (req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    var {cnp, nume, prenume, codCI, seriaCI, numarCI, eliberatDeCI, dataEliberariiCI, 
        localitatea, strada, nrStrada, bloc, scara, nrApartament, 
        judet, sector, telefon} = req.body;
    const addPersonQuery = 
    `       INSERT INTO persoane 
    (cnp, nume, prenume, codCI, seriaCI, numarCI, eliberatDeCI, dataEliberariiCI, 
        localitatea, strada, nrStrada, bloc, scara, nrApartament, 
        judet, sector, telefon) 
            VALUES 
    ('${cnp}', '${nume}', '${prenume}', '${codCI}', '${seriaCI}', '${numarCI}', '${eliberatDeCI}', '${dataEliberariiCI}',
    '${localitatea}', '${strada}', '${nrStrada}', '${bloc}', '${scara}', '${nrApartament}', 
    '${judet}', '${sector}', '${telefon}')`;
    
    mysqlConnectionPool.query(addPersonQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.send({
                "message" : "Persoana a fost adaugata cu succes in baza de date"
            });
        }
        else {
            console.log('DB connection failed. \n Error : ' + JSON.stringify(err));
            res.status(500);
            res.send(JSON.stringify(err));
            return;
        }
    })
})

router.put("/editPerson", (req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    var {cnp, nume, codCI, prenume, seriaCI, numarCI, eliberatDeCI, dataEliberariiCI, 
        localitatea, strada, nrStrada, bloc, scara, nrApartament, 
        judet, sector, telefon} = req.body;
        const editPersonQuery = 
        ` UPDATE persoane SET  nume = ?, prenume = ?, codCI = ?, seriaCI = ?, numarCI = ?, eliberatDeCI = ?, dataEliberariiCI = ?, 
            localitatea = ?, strada = ?, nrStrada = ?, bloc = ?, scara = ?, nrApartament = ?, 
            judet = ?, sector = ?, telefon = ? WHERE cnp = ?
        `
        mysqlConnectionPool.query(editPersonQuery, [nume, prenume, codCI, seriaCI, numarCI, eliberatDeCI, dataEliberariiCI, 
            localitatea, strada, nrStrada, bloc, scara, nrApartament, 
            judet, sector, telefon, cnp], (err, rows, fields) => {
                if (!err) {
                    res.setHeader('200', {'Content-Type' : 'application/json'});  
                    res.json(req.body);
                }
                else {
                    console.log('DB connection failed. \n Error : ' + JSON.stringify(err));
                    res.status(500);
                    res.send(JSON.stringify(err));
                    return;
                }
        
            });
}); 

/*   ---- get persons from db   */

router.get('/getPersons',((req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const getPersonsQuery = `SELECT * FROM persoane LEFT JOIN citypes ON persoane.codCI = citypes.codCI`;
    mysqlConnectionPool.query(getPersonsQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'}); 
            res.send(rows);
        }
        else {
            console.log('DB connection failed. \n Error : ' + JSON.stringify(err));
            res.status(500);
            res.send(JSON.stringify(err));
            return;
        }
    })
    })
);

/*   ---- Delete persons from db   */

router.delete('/deletePerson',((req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    const pers = req.body;
    const deletePersonQuery = `DELETE FROM persoane WHERE cnp=${pers.cnp}`;
    mysqlConnectionPool.query(deletePersonQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'}); 
            res.send({
                "message" : `Persoana ${pers.nume} ${pers.prenume} a fost stearsa din Baza de Date`
            });
        }
        else {
            console.log('Eroare la stergerea din baza de date. \n Error: ' + JSON.stringify(err));
            res.setHeader('500', {'Content-Type' : 'application/json'}); 
            res.send({
                "message" : `Persoana ${pers.nume} ${pers.prenume} NU a fost stearsa din baza de date`
            })
        }
    })
}));




module.exports = router;
