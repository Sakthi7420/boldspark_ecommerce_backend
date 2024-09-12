// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = (roles = []) => {
//   // roles param can be a single role string (e.g. 'admin') or an array of roles (e.g. ['admin', 'user'])
//   if (typeof roles === 'string') {
//     roles = [roles];
//   }

//   return async (req, res, next) => {
//     try {
//       // Extract token from header
//       const token = req.headers.authorization?.split(' ')[1];
//       if (!token) return res.status(401).json({ message: 'No token provided' });

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId).select('-password');

//       // Check user role
//       if (roles.length && !roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   };
// };

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

module.exports = authMiddleware;
