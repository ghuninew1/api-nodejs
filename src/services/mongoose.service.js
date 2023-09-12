const mongoose = require('mongoose');
const config = require('../../config');
let count = 0;
const URI = config.mongo_uri;

const options = {
    // autoIndex: true, // Don't build indexes
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    user: config.mongo_user,
    pass: config.mongo_pass,
    // compressors: 'zlib',
};

const connectWithRetry = async () => {
    console.log('MongoDB connection with retry '+count)
    await mongoose.connect(URI, options).then(()=>{
        console.log( "status: connected  V." + mongoose.version + " DBname: " + mongoose.connection.name + " Host: " + mongoose.connection.host + ':' + mongoose.connection.port + " Model: " + mongoose.modelNames())
    }).catch(err=>{
        console.log( "status: error" +  "error: " + err + "message : retry after 5 seconds " + count)
        count++
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
