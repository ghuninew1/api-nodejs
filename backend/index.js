/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const studentRoute = require('./api/student');
const productRoute = require('./api/products');
const datatestRoute = require('./api/datatest');

mongoose.connect('mongodb+srv://admin1:bbpadmin2022@atlascluster.aufwdcz.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log( 'Connected to database! ' );
}, error => {
  console.log('Could not connect to database: ' + error);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.get('/', (req, res) => {
  const isTime = new Date().toLocaleString('th');
  res.send(JSON.parse('{"Tiie": "' + isTime + '"}'));
});

studentRoute(app);
productRoute(app);
datatestRoute(app);
app.use('/api', studentRoute);
app.use('/api', productRoute);
app.use('/api', datatestRoute);

// Static build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  });
}
const port = 4000;

//start server && listen
app.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
