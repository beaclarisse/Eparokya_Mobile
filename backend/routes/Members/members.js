const express = require('express');
const router = express.Router();
const { upload } = require('../../config/cloudinary');
const membersController = require('../../controllers/MembersController');

router.get('/', membersController.getMembers);
router.get('/:id', membersController.getMemberById);
router.post('/create', upload.single('image'), membersController.createMemberHistory);
router.put('/edit/:id', upload.single('image'), membersController.updateMemberHistory);
router.delete('/delete/:id', membersController.deleteMemberHistory);

module.exports = router;
