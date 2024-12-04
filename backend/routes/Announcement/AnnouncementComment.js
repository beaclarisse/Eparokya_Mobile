const express = require('express');
const router = express.Router();
const AnnouncementCommentController = require('../../controllers/AnnouncementCommentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { isAuthenticated, isAuthorized } = require('../../middlewares/Auth');

router.post('/comment/:announcementId', isAuthenticated, AnnouncementCommentController.addComment);
router.put('/announcementId/comment/update/:commentId', isAuthenticated, AnnouncementCommentController.updateCommentOrReply);
router.delete('/announcementId/comment/delete/:commentId', isAuthenticated, AnnouncementCommentController.deleteCommentOrReply);

router.get('/:announcementId/comments', AnnouncementCommentController.getCommentsWithReplies);
router.get('/comments/:announcementId', AnnouncementCommentController.getCommentsWithReplies);

router.post('/comment/like/:commentId', isAuthenticated, AnnouncementCommentController.likeComment);
router.post('/comment/unlike/:commentId', isAuthenticated, AnnouncementCommentController.unlikeComment);

router.post('/comment/reply/:commentId', isAuthenticated, AnnouncementCommentController.addReply);

module.exports = router;