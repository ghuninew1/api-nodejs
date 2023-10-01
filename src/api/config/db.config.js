const mongoose = require("mongoose");
exports.config = {
    port: 3001,
    appEndpoint: "http://localhost:3001",
    mongo_uri2: "mongodb://admin1:bbpadmin2022@192.168.1.35:27017/gnew?authSource=admin",
    mongo_uri: "mongodb://admin1:bbpadmin2022@ais.bigbrain-studio.com:27017/gnew?authSource=admin",
    unix_socket: "/tmp/apignew.sock",
    line_token: "S3IaBMDxFxlaSaL74mQJeNwQhQU8VTuUKbGgsbEqqTs",
};

exports.connect = async () => {
    try {
        await mongoose.connect(exports.config.mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`V.${mongoose.version} model: ${mongoose.modelNames()}`);
    } catch (err) {
        console.error("Connection error", err);
        process.exit();
    } finally {
        console.log("MongoDB connected");
    }
};