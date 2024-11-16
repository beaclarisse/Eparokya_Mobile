const express = require('express');
const router = express.Router();
const WeddingFormController = require('../controllers/WeddingFormController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const cloudinary = require('../config/cloudinary');

// router.post('/submit', upload.fields([
//     { name: 'birthCertificateBride', maxCount: 1 },
//     { name: 'birthCertificateGroom', maxCount: 1 },
//     { name: 'pictureBride', maxCount: 1 },
//     { name: 'pictureGroom', maxCount: 1 },
//     { name: 'ceremonyPicture', maxCount: 1 },
//     { name: 'baptismalCertificateBride', maxCount: 1 },
//     { name: 'baptismalCertificateGroom', maxCount: 1 }
// ]), WeddingFormController.submitWeddingForm);


router.post('/submit', isAuthenticated, WeddingFormController.submitWeddingForm);
router.post('/:id/confirm', WeddingFormController.confirmWedding);
router.get('/confirmed', WeddingFormController.getConfirmedWeddings);
router.post('/decline', WeddingFormController.declineWedding);
router.post('/:weddingId/admin/addComment', WeddingFormController.addComment);

//WeddingDates
router.get('/weddingDate', WeddingFormController.getAvailableDates);
router.post('/book/date', WeddingFormController.bookDate);

//AdminWeddingDate
router.post('/admin/available-dates', isAuthenticated, isAuthorized, WeddingFormController.addAvailableDate);
router.delete('/admin/available-dates/:id', isAuthenticated, isAuthorized, WeddingFormController.removeAvailableDate);

//GeneralDisplay
router.get('/', WeddingFormController.getAllWeddings);
router.get('/:id', WeddingFormController.getWeddingById);

module.exports = router;
