const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
} = require("../api/controllers/api");
const { auth } = require("../api/middleware/auth");

module.exports = (app) => {
    app.get("/api", auth, findAll);
    app.get("/api/:name", /* auth, */ findOne);
    app.get("/api/:name/:id", /* auth, */ findById);
    app.post("/api/:name", auth, createByName);
    app.put("/api/:name/:id", auth, updateByid);
    app.delete("/api/:name/:id", auth, deleteByid);
    app.delete("/api/:name/del", auth, deleteAll);
};
