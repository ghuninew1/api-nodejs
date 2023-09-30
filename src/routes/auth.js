const { auth } = require("../api/middleware/auth");
const { register, login, currentUser } = require('../api/controllers/auth')

module.exports = (app) => {
    app.post('/auth/users', auth, currentUser)
    app.post("/auth/signin", login);
    app.post("/auth/signup", register);
}