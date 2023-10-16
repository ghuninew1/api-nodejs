const mongoose = require("mongoose");
exports.config = {
    port: 3001,
    ports: 3002,
    appEndpoint: "http://localhost:3001",
    mongo_uri1: "mongodb+srv://admin1:new4248085@atlascluster.aufwdcz.mongodb.net/gnew?retryWrites=true&w=majority",
    mongo_uri: "mongodb://admin1:bbpadmin2022@mongo.bigbrain-studio.com:27017/?authMechanism=DEFAULT&authSource=admin",
    unix_socket: "/tmp/apignew.sock",
    line_token: "aFTg44EBeLANyh7sJQSXIhfvlmxci7VPPU9GBe0mIb2",
    // line_token: "S3IaBMDxFxlaSaL74mQJeNwQhQU8VTuUKbGgsbEqqTs",
};

exports.connect = async () => {
    try {
        await mongoose.connect(exports.config.mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("Error connecting to database", err);
    } finally {
        console.log("Connected to MongoDB");
    }
};

