const { auth } = require("../api/middleware/auth");
const { register, login, generateToken, currentUser } = require('../api/controllers/auth')

module.exports = (app) => {
    app.post('/register', register)
    app.post('/login', login)
    app.post('/gentoken/:name', generateToken)
    app.post('/users', auth, currentUser)
}
