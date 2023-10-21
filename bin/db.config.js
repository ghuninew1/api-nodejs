const mongoose = require("mongoose");
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
