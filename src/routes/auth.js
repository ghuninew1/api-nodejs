
const { register, login } = require('../api/Users')

module.exports = (app) => {
    app.post('/register', register)
    app.post('/login', login)
}
