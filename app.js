const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const router = require('./routes/routesIndex');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(router);

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined',{ stream: accessLogStream }));

app.listen(3000, () => {
    console.log('You dawgs... now listening to port 3000 from server');
});

