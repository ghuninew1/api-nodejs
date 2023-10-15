const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
    lineNotify,
} = require("../src/api/controllers/api");
const { auth } = require("../src/api/middleware/auth");
const { upload, progressUpload } = require("../src/api/middleware/upload");

const router = require("express").Router();

router.get("/api", /* auth, */ findAll);
router.get("/api/:name", /* auth, */ findOne);
router.get("/api/:name/:id", /* auth, */ findById);
router.post("/api/:name", /* auth, *//* progressUpload, */ upload, createByName);
router.put("/api/:name/:id", /* auth, *//* progressUpload, */ upload, updateByid);
router.delete("/api/:name/:id", /* auth, */ deleteByid);
router.delete("/del/:name", /* auth, */ deleteAll);

router.post("/line", /* auth, */ lineNotify);

module.exports = router;

