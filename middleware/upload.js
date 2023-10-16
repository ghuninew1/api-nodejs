const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            new Date().toLocaleDateString("th").replace(/\//g, "_") +
            "_" +
            new Date().toLocaleTimeString("th").replace(/:/g, "-") +
            "_" +
            req.params.name;
        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

// exports.upload = multer({storage: storage,limits: { fileSize: 1024 * 1024 * 10000 }}).single("file");
exports.upload = (req, res, next) => {
    try {
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 10000 },
        }).single("file");
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError)
                throw next({
                    statusCode: 500,
                    message: "Server Error: " + err + " " + err.message,
                });
            else if (err)
                throw next({
                    statusCode: 500,
                    message: "Server Error: " + err + " " + err.message,
                });
            next();
        });
    } catch (err) {
        next(err);
    }
};

exports.progressUpload = (req, res, next) => {
    try {
        let progres = 0;
        let file_size = req.headers["content-length"] ? parseInt(req.headers["content-length"]) : 0;

        req.on("data", (chunk) => {
            progres += chunk.length;
            const persent = Math.floor((progres / file_size) * 100).toFixed(2);
            req.upload = `${persent}%`;
            console.log(`Upload Progress ${persent}%`);
        });
        req.on("end", () => {
            console.log(`Upload Success ${(progres / 1024 / 1024).toFixed(3)} MB , ${req?.upload}`);
        });
        next();
    } catch (err) {
        next(err);
    }
};
