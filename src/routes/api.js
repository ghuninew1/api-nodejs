const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
    pingCheck,
    ipPublic,
    lineNotify,
} = require("../api/controllers/api");
const { auth } = require("../api/middleware/auth");
const { upload, progressUpload } = require("../api/middleware/upload");
const { visitUpdate } = require("../api/middleware/visit");

module.exports = (app) => {
    app.get("/api", /* auth, */ findAll);
    app.get("/api/:name", /* auth, */ findOne);
    app.get("/api/:name/:id", /* auth, */ findById);
    app.post("/api/:name", /* auth, */ progressUpload, upload, createByName);
    app.put("/api/:name/:id", /* auth, */progressUpload, upload, updateByid);
    app.delete("/api/:name/:id", /* auth, */ deleteByid);
    app.delete("/del/:name",  /* auth, */ deleteAll);
    
    app.get("/ping", /* auth, */ pingCheck);
    app.get("/ip", /* auth, */ visitUpdate, ipPublic);
    app.post("/line", auth, lineNotify);

    // app.get("/app/getdata", getTestData);
    // app.post("/app/getdata", getTestData);
    // app.get("/app/up", getUploadSpeed);
    // app.get("/app/down", getDownloadSpeed);


};
