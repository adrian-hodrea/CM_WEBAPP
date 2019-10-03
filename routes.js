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

/*   ---- Get persons from db   */

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


/*  Routes for dealing with Child model  */ 

router.post("/postCopilNou", (req, res) => {
    console.log(req.body);
    const mysqlConnectionPool = createConnectionPool();
    var {cnp, nume, prenume, seriaCN, numarCN, dataNasterii, 
        tataFk, mamaFk} = req.body;
    const addPersonQuery = 
    `       INSERT INTO copii 
    (cnp, nume, prenume, serie_cn, numar_cn, data_nasterii, 
        tata_fk, mama_fk)
            VALUES 
    ('${cnp}', '${nume}', '${prenume}', '${seriaCN}', '${numarCN}', '${dataNasterii}',
    '${tataFk}', '${mamaFk}')`;
    
    mysqlConnectionPool.query(addPersonQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.send({
                "message" : "Copilul a fost adaugat cu succes in baza de date"
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


router.get('/getChildren',((req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const getChildrenQuery = `SELECT 
        copii.nume AS nume, copii.prenume AS prenume, copii.cnp AS cnp, 
        copii.data_nasterii AS dataNasterii, copii.serie_cn AS seriaCN, 
        copii.numar_cn AS numarCN, 
        persoane_tata.nume AS numeTata, persoane_tata.prenume AS prenumeTata,
        persoane_mama.nume AS numeMama, persoane_mama.prenume AS prenumeMama,
        copii.tata_fk as tataFk, copii.mama_fk as mamaFk
    FROM copii 
        JOIN persoane persoane_tata ON copii.tata_fk = persoane_tata.pers
        JOIN persoane persoane_mama ON copii.mama_fk = persoane_mama.pers
    `;
    mysqlConnectionPool.query(getChildrenQuery, (err, rows, fields) => {
        if (!err) {
            console.log(rows);
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

router.delete('/deleteChild',((req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    const child = req.body;
    console.log(child);
    const deleteChildQuery = `DELETE FROM copii WHERE cnp=${child.cnp}`;
    mysqlConnectionPool.query(deleteChildQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'}); 
            res.send({
                "message" : `Copilul ${child.nume} ${child.prenume} a fost stears din Baza de Date`
            });
        }
        else {
            console.log('Eroare la stergerea din baza de date. \n Error: ' + JSON.stringify(err));
            res.setHeader('500', {'Content-Type' : 'application/json'}); 
            res.send({
                "message" : `Copilul ${child.nume} ${child.prenume} NU a fost stears din baza de date`
            })
        }
    })
}));

router.put("/editChild", (req,res) => {
    const mysqlConnectionPool = createConnectionPool();
    var {cnp, nume, prenume, seriaCN, numarCN, dataNasterii, 
        tataFk, mamaFk} = req.body;
        console.log ("Date de la browser pe update child:", req.body);
        const editChildQuery = 
        ` UPDATE copii SET  nume = ?, prenume = ?, serie_cn = ?, numar_cn = ?, data_nasterii = ?, 
          tata_fk = ?, mama_fk = ? WHERE cnp = ?
        `
        mysqlConnectionPool.query(editChildQuery, [nume, prenume, seriaCN, numarCN, dataNasterii, 
            tataFk, mamaFk, cnp], (err, rows, fields) => {
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


module.exports = router;
