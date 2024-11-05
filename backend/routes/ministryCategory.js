const express = require('express');
const router = express.Router();
const ministryCategoryController = require('../controllers/ministryCategoryController');
const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

router.get('/', ministryCategoryController.getMinistry);
router.get('/:id', ministryCategoryController.getMinistryId );
router.post('/create', ministryCategoryController.createMinistry );
router.delete('/:id', ministryCategoryController.deleteMinistry );
router.put('/:id', ministryCategoryController.updateMinistryCategory );

module.exports = router;