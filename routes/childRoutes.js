const router = require("express").Router();
const createConnectionPool = require('./dbConnectionPool.js'); 

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
        copii.copil, copii.nume AS nume, copii.prenume AS prenume, copii.cnp AS cnp, 
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