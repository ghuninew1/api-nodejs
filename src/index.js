const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// const flash = require("express-flash");
const session = require("express-session");

const studentRoute = require("./api/student");
const productRoute = require("./api/products");
const datatestRoute = require("./api/datatest");
const resTime = require("./common/middlewares/resTime");

// const AuthorizationRouter = require('./authorization/routes.config');
// const UsersRouter = require('./users/routes.config');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({ origin: "*"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// app.use(session({
    // name: "ghuniNew",
//   cookie: { maxAge: 60 },
//   store: new session.MemoryStore,
//   saveUninitialized: true,
//   resave: 'true',
//   secret: 'secret'
// }))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'ghuninew test',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60 }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.header("X-Response-Time", resTime(process.hrtime()) + " ms");
    res.header("X-Powered-By", "GhuniNew");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get("/", (req, res) => {
    const dataRes = resTime(process.hrtime()) + " ms" 
    const result =[dataRes, req.sessionID, req.session.cookie.maxAge]
    res.render('index', {title: "GNEW", maindata: "GhuniNew", secdata: result});
});

app.route

// routes Api
studentRoute(app);
productRoute(app);
datatestRoute(app);

// AuthorizationRouter.routesConfig(app);
// UsersRouter.routesConfig(app);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
});

// error handler
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const server = http.createServer(app);
server.listen(3000, function () {
    console.log(`app running on http://localhost:${server.address().port}`);
});
