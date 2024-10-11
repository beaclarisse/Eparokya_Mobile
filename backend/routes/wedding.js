const express = require('express');
const router = express.Router();
const WeddingFormController = require('../controllers/WeddingFormController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

router.post('/submit',  WeddingFormController.submitWeddingForm);
router.post('/confirmed',  WeddingFormController.confirmWedding);
router.post('/decline',  WeddingFormController.declineWedding);

router.get('/', WeddingFormController.getAllWeddings);
router.get('/:id', WeddingFormController.getWeddingById);

// router.put('/:id', WeddingFormController.updateWedding);

module.exports = router;
