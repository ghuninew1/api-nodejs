const { pingCheck, ipPublic, insertTimeSeries, getIpTimeSeries } = require('../api/controllers/ping');
// const { auth } = require('../api/middleware/auth');
const { Router } = require('express'); 
const router = Router();

router.get('/ping', pingCheck);
router.get('/ip', ipPublic);
router.post('/insert', insertTimeSeries);
router.get('/getIp', getIpTimeSeries);

module.exports = router;