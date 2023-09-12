
const { register, login, generateToken } = require('../api/controllers/auth')

module.exports = (app) => {
    app.post('/register', register)
    app.post('/login', login)
    app.post('/generateToken', generateToken)
}
