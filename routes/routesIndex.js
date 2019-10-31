const express = require("express");
const router = express.Router();
const fs = require('fs');
var mysql = require('mysql');
const arrayToTree = require('array-to-tree');
const bodyparser = require('body-parser');

router.use(bodyparser.json());
router.use('/frontend', express.static('frontend'));
router.use('/assets', express.static('assets'));
router.use('/getMenuTree', require('./menuTreeRoutes.js')); 
router.use('/getIdDocTypes', require('./idDocTypesRoutes.js')); 
router.use('/getCodIndemnizatiiList', require('./codIndemnizatiiRoutes.js')); 
router.use('/', require('./contracteRoutes.js')); 
router.use('/', require('./persoaneRoutes.js')); 
router.use('/', require('./childRoutes.js')); 



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




/* ------- Persoane --------- */



/*   ---- Get persons from db   */


/*   ---- Delete persons from db   */



/*  Routes for dealing with Child model  */ 





/* ---------   Concedii medicale -------- */

router.get('/getConcediiMedicaleList', (req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const query = `SELECT 
    cm, serie_cm AS serieCM, numar_cm AS numarCM, idctr_fk AS idCtrFk, pers_fk AS persFk, 
    data_acordarii AS dataAcordarii, de_la_data AS deLaData, la_data AS laData, 
    tip_init_cont AS tipInitCont, cod_indemnizatie_fk AS codIndemnizatieFk, 
    cm_init_fk AS cmInitFk, copil_fk as copilFk
    FROM concedii_medicale`;
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


router.post("/postConcediuMedicalNou", (req, res) => {
    console.log(req.body);
    const mysqlConnectionPool = createConnectionPool();
    var {serieCM, numarCM, persFk, dataAcordarii, deLaData, laData, 
        tipInitCont, codIndemnicatieFk, cmInitFk, copilFk, idCtrFk} = req.body;
    if (cmInitFk ==="")  { cmInitFk = "NULL"};
    console.log("cmInitFk are valoarea: ", cmInitFk);  
    const addPersonQuery = 
    `       INSERT INTO concedii_medicale 
        (serie_cm, numar_cm, pers_fk, data_acordarii, de_la_data, la_data, 
        tip_init_cont, cod_indemnizatie_fk, cm_init_fk, copil_fk, idctr_fk)
            VALUES 
        ('${serieCM}', '${numarCM}', '${persFk}', '${dataAcordarii}', '${deLaData}', '${laData}',
        '${tipInitCont}', '${codIndemnicatieFk}', ${cmInitFk} , '${copilFk}', '${idCtrFk}')`;
    
    mysqlConnectionPool.query(addPersonQuery, (err, rows, fields) => {
        if (!err) {
            res.setHeader('200', {'Content-Type' : 'application/json'});  
            res.send({
                "message" : "Concediu medical a fost adaugat cu succes in baza de date"
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


module.exports = router;
