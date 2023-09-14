const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = new Date().toLocaleString('th').replace(/:|\//g, "-") + "_" + req.params.name;
        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

exports.upload = multer({ storage: storage }).single("file");
