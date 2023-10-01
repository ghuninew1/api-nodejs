const { auth } = require('../api/middleware/auth')
const { register, login, currentUser } = require('../api/controllers/auth')
const { Router } = require('express');

const router = Router();

router.post('/auth/users', auth, currentUser)
router.post("/auth/signin", login);
router.post("/auth/signup", register);

module.exports = router;

