const router = require("express").Router();
const createConnectionPool = require('./dbConnectionPool.js'); 

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

router.get('/getPersons',((req, res) => {
    const mysqlConnectionPool = createConnectionPool();
    const getPersonsQuery = `SELECT * FROM persoane LEFT JOIN ci_types ON persoane.idci_fk = ci_types.ci_id`;
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
    }) // end of query method


    }) // end of get method


);

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