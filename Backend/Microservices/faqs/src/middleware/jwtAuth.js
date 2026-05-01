const jwt = require('jsonwebtoken');
const Tenant = require('../../../tenant/src/model/tenant.model');

const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tenant = await Tenant.findById(decoded.id).select('-passwordHash');
    if (!tenant) {
      return res.status(401).json({ success: false, message: 'Tenant not found' });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = jwtAuth;
