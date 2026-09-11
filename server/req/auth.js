import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback to Authorization header if provided
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  const secret = process.env.JWT_SECRET || 'haatlink-dev-secret-change-in-production';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    }
    req.user = decoded;
    next();
  });
};
