const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./database/db');
const path = require('path');
const studentRoute = require('./api/student');
const datatestRoute = require('./api/datatest');

mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Database successfully connected');
}, 
    error => {
        console.log('Could not connect to database: ' + error)
    }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors());

app.get('/', (req, res) => {
    const isTime = new Date().toLocaleString('th');
    res.send(JSON.parse('{"Tiie": "' + isTime + '"}'))
});

studentRoute(app);
datatestRoute(app);
app.use('/api', studentRoute);
app.use('/api', datatestRoute);

// Static build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../build/index.html"))
    })
}

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Error handler
app.use(function(err, req, res) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})