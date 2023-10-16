const { Router } = require('express');
const { visitPageCreate, visitPageView } = require('../controllers/visit');
const { auth } = require('../middleware/auth');

const router = Router();

router.get('/visit', /* auth, */ visitPageView);
router.post('/visit', auth, visitPageCreate);

module.exports = router;