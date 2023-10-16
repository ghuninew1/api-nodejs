const { pingCheck, ipPublic, insertTimeSeries, getIpTimeSeries } = require('../controllers/ping');
// const { auth } = require('../api/middleware/auth');
const { Router } = require('express'); 
const { lineNotify } = require('../controllers/notify');

const router = Router();

router.get('/ping', pingCheck);
router.get('/ip', ipPublic);
router.post('/insert', insertTimeSeries);
router.get('/getip', getIpTimeSeries);

router.post("/linenotify", /* auth, */ lineNotify);

module.exports = router;