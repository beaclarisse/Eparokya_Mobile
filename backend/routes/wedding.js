const express = require('express');
const router = express.Router();
const WeddingFormController = require('../controllers/WeddingFormController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

//FormSubmission
router.post('/submit',  WeddingFormController.submitWeddingForm);
router.patch('/:id/confirm', WeddingFormController.confirmWedding);
router.get('/confirmed', WeddingFormController.getConfirmedWeddings);
router.post('/decline',  WeddingFormController.declineWedding);

//WeddingDates
router.get('/weddingDate',  WeddingFormController.getAvailableDates);
router.post('/book/date',  WeddingFormController.bookDate);

//AdminWeddingDate
router.post('/admin/available-dates', isAuthenticated, isAuthorized, WeddingFormController.addAvailableDate);
router.delete('/admin/available-dates/:id', isAuthenticated, isAuthorized, WeddingFormController.removeAvailableDate);

//GeneralDisplay
router.get('/', WeddingFormController.getAllWeddings);
router.get('/:id', WeddingFormController.getWeddingById);

// router.put('/:id', WeddingFormController.updateWedding);

module.exports = router;
