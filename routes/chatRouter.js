const router = require('express').Router();
const auth = require('../middleware/auth');
const chatCtrl = require('../controllers/ChatCtrl');

router.route('/chat')
    .get(auth, chatCtrl.joinChat);
    

module.exports = router;