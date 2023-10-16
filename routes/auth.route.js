const { auth } = require('../middleware/auth')
const { register, login, currentUser, confirmUser} = require('../controllers/auth')
const { Router } = require('express');
const bodyParser = require('body-parser');

const router = Router();
const urlEncode = bodyParser.urlencoded({ extended: false, parameterLimit: 50000, limit: '150mb' });

router.post('/auth/user', auth, currentUser)
router.post("/auth/signin",urlEncode, login);
router.post("/auth/signup",urlEncode, register);
router.post("/auth/confirm", confirmUser);

module.exports = router;
