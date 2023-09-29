const mongoose = require("mongoose");
const config = require("./config");

let count = 0;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: config.mongo_user,
    pass: config.mongo_pass,
};

const connectWithRetry = async () => {
    try {
        console.log("MongoDB connection with retry " + count);
        await mongoose.connect(config.mongo_uri, options).then(() => {
            console.log(
                "status: connected  V." +
                    mongoose.version +
                    " DBname: " +
                    mongoose.connection.name +
                    " Model: " +
                    mongoose.modelNames()
            );
        });
    } catch (err) {
        console.log("status: error" + "error: " + err + " message : retry after 5 seconds " + count);
        count++;
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

module.exports = mongoose;