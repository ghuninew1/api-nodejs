module.exports = {
    port: 3001,
    appEndpoint: "http://localhost:3001",
    mongo_uri: "mongodb://mongo.bigbrain-studio.com" || "mongodb://tmp/mongodb-27017.sock",
    mongo_user: "admin1",
    mongo_pass: "bbpadmin@2022",
    unix_socket: "/tmp/apignew.sock",
    spans: [
        {
            interval: 1,
            retention: 60,
        },
        {
            interval: 5,
            retention: 60,
        },
        {
            interval: 15,
            retention: 60,
        },
    ],
};
