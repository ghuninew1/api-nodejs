/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const flash = require("express-flash");
const session = require("express-session");

const studentRoute = require("./api/student");
const productRoute = require("./api/products");
const datatestRoute = require("./api/datatest");
const resTime = require("./common/middlewares/resTime");

// const AuthorizationRouter = require('./authorization/routes.config');
// const UsersRouter = require('./users/routes.config');

mongoose
  .connect(
    "mongodb://admin1:bbpadmin@2022@mongo.bigbrain-studio.com/test?tls=false",
    {
      useNewUrlParser: true,
      // useUnifiedTopology: true
    }
  )
  .then(
    () => {
      console.log("Connected to database! ");
    },
    (error) => {
      console.log("Could not connect to database: " + error);
    }
  );

console.log(mongoose.connections);
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(session({
//   cookie: { maxAge: 60 },
//   store: new session.MemoryStore,
//   saveUninitialized: true,
//   resave: 'true',
//   secret: 'secret'
// }))

app.use(flash());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  res.header("X-Response-Time", resTime(process.hrtime()) + " ms");
  res.header("X-Powered-By", "GhuniNew");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.get("/", (req, res) => {
    res.send(resTime(process.hrtime()) + "ms");
});

studentRoute(app);
productRoute(app);
datatestRoute(app);
app.use("/api", studentRoute);
app.use("/api", productRoute);
app.use("/api", datatestRoute);

// AuthorizationRouter.routesConfig(app);
// UsersRouter.routesConfig(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = 4000;
//start server && listen
app.listen(port, () => {
  console.log(`running at: http://localhost:${port}`);
});
