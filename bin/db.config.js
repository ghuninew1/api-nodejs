const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("Error connecting to database", err);
    } finally {
        console.log("Connected to MongoDB");
    }
};
