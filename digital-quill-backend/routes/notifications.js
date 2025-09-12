//routes\notifications.js

const router = require('express').Router();
const auth = require('../middleware/auth');
const nc = require('../controllers/notificationController');

router.get('/', auth, nc.getMy);
router.put('/:id/read', auth, nc.markRead);
router.delete('/clear', auth, nc.clearAll);

module.exports = router;
