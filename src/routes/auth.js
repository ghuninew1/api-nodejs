
const { register, login } = require('../api/controllers/auth')

module.exports = (app) => {
    app.post('/register', register)
    app.post('/login', login)
}
