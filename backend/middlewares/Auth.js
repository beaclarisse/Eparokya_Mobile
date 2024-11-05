const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async (req, res, next) => {
    
    const token = req.headers.authorization
    console.log(req.headers.authorization)
    if (!token) {
        return res.status(401).json({ message: 'Login first to access this resource' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id);

    next()
};

exports.isAuthorized = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `You are not allowed to acccess or do something on this resource` })
        }
        next()
    }
}

// exports.refreshToken = async (req, res) => {
//     const { token } = req.body; 
//     if (!token) return res.sendStatus(401);

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//         const user = await User.findById(decoded.id);
//         const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
//         res.json({ accessToken: newAccessToken });
//     } catch (error) {
//         return res.sendStatus(403);
//     }
// };
