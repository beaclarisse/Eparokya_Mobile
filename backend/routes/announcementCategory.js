const express = require('express');
const router = express.Router();
const announcementCategoryController = require('../controllers/AnnouncementCategoryController');
const upload = require('../utils/multer');  

router.post('/create', upload.single('image'), announcementCategoryController.createAnnouncementCategory);
router.get('/', announcementCategoryController.getAnnouncementCategories);
router.put('/update/:id', announcementCategoryController.updateAnnouncementCategory);
router.delete('/delete/:id', announcementCategoryController.deleteAnnouncementCategory);

module.exports = router;
