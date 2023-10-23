module.exports = {
    secret: "gnewsecret",
    jwtExpiration: 3600, // 1 hour
    jwtRefreshExpiration: 86400, // 24 hours
    option: {
        expiresIn: "1d",
        allowInsecureKeySizes: true,
        algorithm: "HS512",
    },
};
