
const { register, login } = require('../api/Users')

module.exports = app => {

// http://localhost:5000/api/register
    app.post('/register', register)
    app.post('/login', login)
}
