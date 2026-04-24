import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admins only' });
  }
  next();
};

export const policeOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'police') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};