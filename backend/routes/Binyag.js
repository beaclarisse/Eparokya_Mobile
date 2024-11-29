const express = require('express');
const router = express.Router();
const BaptismController = require('../controllers/BinyagController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

router.post('/create', isAuthenticated, BaptismController.submitBaptismForm);
router.get('/list', BaptismController.listBaptismForms)

module.exports = router;