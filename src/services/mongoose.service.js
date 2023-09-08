const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: true, // Don't build indexes
    // poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
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
        console.log('MongoDB is connected DB: '+mongoose.connection.db.databaseName)
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
