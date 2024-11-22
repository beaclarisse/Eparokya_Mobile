const express = require('express');
const router = express.Router();
const { createPostResource, getPostResources, getPostResourceById, updatePostResource, deletePostResource } = require('../../controllers/postResourceController');
const upload = require('../../config/cloudinary').upload;
// router.post(
//     '/create',
//     upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
//     createPostResource
// );

router.post('/create', upload.fields([{ name: 'image' }, { name: 'file' }]), (req, res) => {
    console.log('Files received:', req.files);
    console.log('Body:', req.body);
    res.send({ success: true });
});

router.get('/', getPostResources);
router.get('/:id', getPostResourceById);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updatePostResource);
router.delete('/:id', deletePostResource);

module.exports = router;
