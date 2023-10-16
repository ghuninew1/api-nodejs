const {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
} = require("../controllers/api");
const { auth } = require("../middleware/auth");
const { upload, progressUpload } = require("../middleware/upload");

const router = require("express").Router();

router.get("/api", /* auth, */ findAll);
router.get("/api/:name", /* auth, */ findOne);
router.get("/api/:name/:id", /* auth, */ findById);
router.post("/api/:name", /* auth, *//* progressUpload, */ upload, createByName);
router.put("/api/:name/:id", /* auth, *//* progressUpload, */ upload, updateByid);
router.delete("/api/:name/:id", /* auth, */ deleteByid);
router.delete("/del/:name", /* auth, */ deleteAll);

module.exports = router;

