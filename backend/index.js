const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./database/db');
const path = require('path');
const Student = require('./models/Student')

// Express Route

// Connecting MongDB Database

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
    res.send(JSON.parse('{"message": "Hello World"}'))
});

app.post( '/api/student', async (req, res) => {
    const payload = req.body;
    const student = new Student(payload);
    try {
        await student.save();
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});

app.get('/api/student', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.get('/api/student/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.put('/api/student/:id', async (req, res) => {
    try {
        const payload = req.body;
        const student = await Student.findByIdAndUpdate(req.params.id, payload, {new: true});
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.delete('/api/student/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// Static build

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../build/index.html"))
    })
}

// PORT
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