const { Announcement } = require('../models/Announcements/announcement');
const { User } = require('../models/user');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

exports.createAnnouncement = async (req, res) => {
    try {
        const { name, description, richDescription, tags } = req.body;
        let imageUrl = '';
        let videoUrl = '';
        if (req.files && req.files.image) {
            const image = req.files.image[0];
            const result = await cloudinary.uploader.upload(image.path, {
                folder: 'EParokya_Images',
            });
            imageUrl = result.secure_url;
        }
        if (req.files && req.files.video) {
            const video = req.files.video[0];
            const result = await cloudinary.uploader.upload(video.path, {
                folder: 'EParokya_Images',
                resource_type: 'video',
            });
            videoUrl = result.secure_url;
        }
        const announcement = new Announcement({
            name,
            description,
            richDescription,
            tags: tags.split(','),
            image: imageUrl,
            video: videoUrl,
        });

        await announcement.save();
        res.status(201).json({ message: 'Announcement created successfully', data: announcement });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Failed to create announcement', error });
    }
};


exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().populate('announcementCategory').populate('comments.user');
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching announcements', details: error.message });
    }
};

exports.getAnnouncementById = async (req, res) => {
    const { announcementId } = req.params;

    try {
        const announcement = await Announcement.findById(announcementId)
            .populate('announcementCategory')   
            .populate('comments.user', 'name')  
            .populate('likedBy', 'name')        
            .exec();

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        return res.status(200).json(announcement);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { name, description, richDescription, image, images, videos, announcementCategory, tags, isFeatured } = req.body;

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                richDescription,
                image,
                images,
                videos,
                announcementCategory,
                tags,
                isFeatured
            },
            { new: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ error: 'Error updating announcement', details: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting announcement', details: error.message });
    }
};


exports.updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { announcementId, commentId } = req.params;

        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        const comment = announcement.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.text = text;
        await announcement.save();

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ error: 'Error updating comment', details: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { announcementId, commentId } = req.params;

        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        const comment = announcement.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.remove();
        await announcement.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting comment', details: error.message });
    }
};

exports.likeAnnouncement = async (req, res) => {
    try {
      const announcementId = req.params.announcementId; 
      const userId = req.user.id; 
      console.log("Announcement ID:", announcementId);
      console.log("User ID:", userId);
  
      const announcement = await Announcement.findById(announcementId);
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
        console.log("Current likedBy array:", announcement.likedBy);
        if (announcement.likedBy.includes(userId)) {
        console.log("User has already liked this announcement");
        return res.status(400).json({ error: 'You have already liked this announcement' });
      }
        announcement.likedBy.push(userId);
        await announcement.save();
        const updatedLikesCount = announcement.likedBy.length;
        res.status(200).json({ success: true, likes: updatedLikesCount });
    } catch (error) {
      console.error("Error in liking announcement:", error);
      res.status(500).json({ error: "Failed to like announcement" });
    }
};

exports.unlikeAnnouncement = async (req, res) => {
    try {
        const { announcementId, userId } = req.body;
        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        const index = announcement.likes.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "You have not liked this announcement" });
        }
        announcement.likes.splice(index, 1);
        await announcement.save();
        return res.json({ likes: announcement.likes.length });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while unliking the announcement" });
    }
};

exports.addComment = async (req, res) => {
    const { announcementId } = req.params;
    const { text, userId } = req.body;

    try {
        const announcement = await Announcement.findById(announcementId);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Push the comment
        announcement.comments.push({
            user: userId, 
            text: text || "No text provided",  // Use a default value if text is missing
            dateCreated: new Date()
        });

        await announcement.save();

        return res.status(200).json({ message: 'Comment added successfully', comments: announcement.comments });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};




