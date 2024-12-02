const Funeral = require('../models/Funeral');
const mongoose = require('mongoose');


const validatePlacingOfPall = (placingOfPall) => {
    if (placingOfPall && placingOfPall.by === "Family Member" && (!placingOfPall.familyMembers || placingOfPall.familyMembers.length === 0)) {
        return { valid: false, message: "Family members must be provided if placingOfPall is done by Family Member." };
    }
    return { valid: true };
};


exports.createFuneral = async (req, res) => {
    try {
        const {
            name,
            gender,
            age,
            numberOfSons,
            sons,
            numberOfDaughters,
            daughters,
            contactPerson,
            phone,
            address,  
            funeralDate,
            time,
            serviceType,
            entranceSong,
            placingOfPall,
            funeralStatus,
            userId,
        } = req.body;

        if (new Date(funeralDate) < new Date()) {
            return res.status(400).json({ message: "Funeral date cannot be in the past." });
        }

        const placingValidation = validatePlacingOfPall(placingOfPall);
        if (!placingValidation.valid) {
            return res.status(400).json({ message: placingValidation.message });
        }

        const newFuneral = new Funeral({
            name: {
                firstName: name.firstName,
                middleName: name.middleName,
                lastName: name.lastName,
                suffix: name.suffix,
            },
            gender,
            age,
            numberOfSons,
            sons,
            numberOfDaughters,
            daughters,
            contactPerson,
            phone,
            address: {
                state: address.state,
                zip: address.zip,
                country: address.country,
            },
            funeralDate,
            time,
            serviceType,
            entranceSong,
            placingOfPall: {
                by: placingOfPall.by,
                familyMembers: placingOfPall.by === 'Family Member' ? placingOfPall.familyMembers : [],
            },
            funeralStatus,
            userId,
        });

        await newFuneral.save();
        res.status(201).json({ message: 'Funeral record created successfully', funeral: newFuneral });
    } catch (error) {
        console.error('Error creating funeral record:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getFunerals = async (req, res) => {
    try {
        const funerals = await Funeral.find().populate('userId', 'name email');
        res.status(200).json(funerals);
    } catch (err) {
        console.error('Error fetching funeral entries:', err);
        res.status(500).json({ message: "Error fetching funeral entries.", error: err.message });
    }
};

exports.getFuneralById = async (req, res) => {
    try {
        const funeralId = req.params.id;
        const funeral = await Funeral.findById(funeralId).populate('userId', 'name email');

        if (!funeral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json(funeral);
    } catch (err) {
        console.error('Error fetching funeral entry:', err);
        res.status(500).json({ message: "Error fetching funeral entry.", error: err.message });
    }
};

exports.updateFuneral = async (req, res) => {
    try {
        const funeralId = req.params.id;
        const updates = req.body;

        if (updates.funeralDate && new Date(updates.funeralDate) < new Date()) {
            return res.status(400).json({ message: "Funeral date cannot be in the past." });
        }

        const placingValidation = validatePlacingOfPall(updates.placingOfPall);
        if (!placingValidation.valid) {
            return res.status(400).json({ message: placingValidation.message });
        }

        if (updates.adminRescheduled) {
            updates.adminRescheduled = { date: new Date() };  
        }

        const updatedFuneral = await Funeral.findByIdAndUpdate(funeralId, updates, { new: true });

        if (!updatedFuneral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json(updatedFuneral);
    } catch (err) {
        console.error('Error updating funeral entry:', err);
        res.status(500).json({ message: "Error updating funeral entry.", error: err.message });
    }
};


exports.deleteFuneral = async (req, res) => {
    try {
        const funeralId = req.params.id;
        const deletedFuneral = await Funeral.findByIdAndDelete(funeralId);

        if (!deletedFuneral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        res.status(200).json({ message: "Funeral entry deleted successfully." });
    } catch (err) {
        console.error('Error deleting funeral entry:', err);
        res.status(500).json({ message: "Error deleting funeral entry.", error: err.message });
    }
};

exports.confirmFuneral = async (req, res) => {
    try {
        const funeral = await Funeral.findByIdAndUpdate(
            req.params.id,
            { funeralStatus: 'Confirmed', confirmedAt: new Date() },
            { new: true }
        );
        if (!funeral) return res.status(404).send('Funeral not found.');
        res.send(funeral);
    } catch (err) {
        res.status(500).send('Server error.');
    }
};

exports.cancelFuneral = async (req, res) => {
    try {
        const funeral = await Funeral.findByIdAndUpdate(
            req.params.id,
            { funeralStatus: 'Cancelled' },
            { new: true }
        );
        if (!funeral) return res.status(404).send('Funeral not found.');
        res.send(funeral);
    } catch (err) {
        res.status(500).send('Server error.');
    }
};

// exports.createComment = async (req, res) => {
//     try {
//         const { funeralId } = req.params;
//         console.log('Received funeralId:', funeralId);

//         const { selectedComment, additionalComment, priestName } = req.body; 

//         if (!selectedComment || !priestName) {
//             return res.status(400).json({ message: "Priest name and selected comment are required." });
//         }

//         const funeral = await Funeral.findById(funeralId);
//         if (!funeral) {
//             return res.status(404).json({ message: "Funeral entry not found." });
//         }
//         const newComment = {
//             priest: priestName,
//             scheduledDate: funeral.funeralDate,
//             selectedComment,
//             additionalComment,
//             createdAt: new Date() 
//         };
//         funeral.comments.push(newComment);
//         await funeral.save();

//         res.status(201).json({ message: 'Comment added successfully', comment: newComment });
//     } catch (err) {
//         console.error('Error creating comment:', err);
//         res.status(500).json({ message: "Error creating comment.", error: err.message });
//     }
// };

exports.createComment = async (req, res) => {
    try {
        const { funeralId } = req.params;
        console.log('Received funeralId:', funeralId);

        const { 
            selectedComment, 
            additionalComment, 
            priestName, 
            updatedScheduledDate, 
            adminRescheduledDate, 
            adminRescheduledReason 
        } = req.body;

        // console.log('Request Body:', req.body);

        if (!selectedComment || !priestName) {
            return res.status(400).json({ message: "Priest name and selected comment are required." });
        }

        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral entry not found." });
        }

        const scheduledDate = updatedScheduledDate || funeral.funeralDate;
        const newComment = {
            priest: priestName,
            scheduledDate, 
            selectedComment,
            additionalComment,
            adminRescheduled: {
                date: adminRescheduledDate,
                reason: adminRescheduledReason,
            },
            createdAt: new Date(),
        };

        funeral.comments.push(newComment);
        console.log('Funeral with new comment:', funeral);

        await funeral.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ message: "Error creating comment.", error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { funeralId, commentId } = req.params;
        const funeral = await Funeral.findById(funeralId);

        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const updatedComments = funeral.comments.filter(
            (comment) => comment._id.toString() !== commentId
        );

        funeral.comments = updatedComments;
        await funeral.save();

        res.status(200).json({ message: "Comment deleted successfully.", comments: funeral.comments });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: "Error deleting comment.", error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { funeralId, commentId } = req.params;
        const updates = req.body;
        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return res.status(404).json({ message: "Funeral not found." });
        }

        const comment = funeral.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }
        Object.keys(updates).forEach((key) => {
            comment[key] = updates[key];
        });
        await funeral.save();
        res.status(200).json({ message: "Comment updated successfully.", comment });
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ message: "Error updating comment.", error: err.message });
    }
};  

exports.getConfirmedFunerals = async (req, res) => {
    try {
      const confirmedFunerals = await Funeral.find({ funeralStatus: 'Confirmed' }); 
      res.status(200).json(confirmedFunerals);
    } catch (error) {
      console.error('Error fetching confirmed funerals:', error);
      res.status(500).json({ error: 'Failed to fetch confirmed funerals' });
    }
  };








