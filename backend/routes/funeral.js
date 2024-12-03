const express = require('express');
const router = express.Router();
const funeralController = require('../controllers/FuneralController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');


router.post('/create', funeralController.createFuneral);
router.get('/confirmed', funeralController.getConfirmedFunerals);
router.get('/', funeralController.getFunerals);
router.get('/:id', funeralController.getFuneralById);
router.put('/update/:id', funeralController.updateFuneral);
router.delete('/delete/:id', funeralController.deleteFuneral);
router.put('/confirm/:id', funeralController.confirmFuneral);
router.put('/cancel/:id', funeralController.cancelFuneral);

router.post('/comment/:funeralId', funeralController.createComment);
router.delete('/comment/:funeralId/:commentId', funeralController.deleteComment);
router.put('/comment/:funeralId/:commentId', funeralController.updateComment);


module.exports = router;
