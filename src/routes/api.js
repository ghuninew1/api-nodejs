const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
    visits,
    pingCheck,
    ipPublic,
    lineNotify,
} = require("../api/controllers/api");
const { auth } = require("../api/middleware/auth");
const { upload } = require("../api/middleware/upload");

module.exports = (app) => {
    app.get("/api", auth, findAll);
    app.get("/api/:name", /* auth, */ findOne);
    app.get("/api/:name/:id", /* auth, */ findById);
    app.post("/api/:name", auth, upload, createByName);
    app.put("/api/:name/:id", auth, upload, updateByid);
    app.delete("/api/:name/:id", auth, deleteByid);
    app.delete("/del/:name",  auth, deleteAll);
    
    app.get("/visits", auth, visits);
    app.get("/ping", auth, pingCheck);
    app.get("/ip", auth, ipPublic);
    app.post("/line", auth, lineNotify);
};
