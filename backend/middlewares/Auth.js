const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

//simple working logged in 
// exports.isAuthenticated = async (req, res, next) => {

//     const token = req.headers.authorization
//     console.log(req.headers.authorization)

//     if (!token) {
//         return res.status(401).json({ message: 'Login first to access this resource' })
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = { id: decoded.id }; 
//         next();
//       } catch (error) {
//         return res.status(401).json({ message: 'Invalid or expired token' });
//       }
//     };

// exports.isAuthenticated = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     console.log("Authorization Header:", authHeader);  
//     console.log("Token received:", token);  
//     const decoded = jwt.decode(token, { complete: true });  
//     console.log("Decoded Token:", decoded);  
//     if (!decoded || !decoded.payload.id) {
//       return res.status(401).json({ error: "Unauthorized: Invalid token" });
//     }

//     req.user = decoded.payload; 
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);  
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };

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
