const express = require('express');
const router = express.Router();
const BaptismController = require('../controllers/BinyagController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

router.post('/create', isAuthenticated, BaptismController.submitBaptismForm);
router.get('/mySubmittedForms', isAuthenticated, BaptismController.getMySubmittedForms);

router.get('/list', BaptismController.listBaptismForms)
router.get('/:id', BaptismController.getBaptismById)

router.get('/confirmed', BaptismController.getConfirmedBaptisms)
router.post('/:id/confirm', BaptismController.confirmBaptism)
router.post('/decline/:id', BaptismController.declineBaptism)
router.post('/:id/admin/addComment', BaptismController.addBaptismComment)

module.exports = router;