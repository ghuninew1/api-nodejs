const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: true, // Don't build indexes
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    user: "admin1",
    pass: "bbpadmin@2022",
    compressors: 'zlib',
};
const connectWithRetry = async () => {
    console.log('MongoDB connection with retry '+count)
    await mongoose.connect("mongodb://mongo.bigbrain-studio.com", options).then(()=>{
        console.log( "status: connected  V." + mongoose.version + " DBname: " + mongoose.connection.name + " Host: " + mongoose.connection.host + ':' + mongoose.connection.port + " Model: " + mongoose.modelNames())
    }).catch(err=>{
        console.log( "status: error" +  "error: " + err + "message : retry after 5 seconds " + count)
        count++
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
