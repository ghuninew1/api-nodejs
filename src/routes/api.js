const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
    lineNotify,
} = require("../api/controllers/api");
const { visitPageCreate, visitPageView } = require("../api/controllers/visit");
const { insertTimeSeries, pingCheck, ipPublic, getIpTimeSeries } = require("../api/controllers/ping");
const { auth } = require("../api/middleware/auth");
const { upload, progressUpload } = require("../api/middleware/upload");
const { visitUpdate } = require("../api/middleware/visit");

module.exports = (app) => {
    app.get("/api", /* auth, */ findAll);
    app.get("/api/:name", /* auth, */ findOne);
    app.get("/api/:name/:id", /* auth, */ findById);
    app.post("/api/:name", auth, progressUpload, upload, createByName);
    app.put("/api/:name/:id", auth, progressUpload, upload, updateByid);
    app.delete("/api/:name/:id", auth, deleteByid);
    app.delete("/del/:name", auth, deleteAll);

    app.get("/ping", /* auth, */ pingCheck);
    app.get("/ip", /* auth, */ visitUpdate, ipPublic);
    app.post("/line", auth, lineNotify);
    app.post("/pingsave",  auth, insertTimeSeries);
    app.get("/pingsave", /* auth, */ getIpTimeSeries);

    app.get("/visit", auth, visitPageView);
    app.post("/visit", auth, visitPageCreate);
};
