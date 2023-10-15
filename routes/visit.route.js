const { Router } = require('express');
const { visitPageCreate, visitPageView } = require('../src/api/controllers/visit');
const { auth } = require('../src/api/middleware/auth');

const router = Router();

router.get('/visit', /* auth, */ visitPageView);
router.post('/visit', auth, visitPageCreate);

module.exports = router;