const Tenant = require('../../../tenant/src/model/tenant.model');

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ success: false, message: 'API key missing' });
    }

    const tenant = await Tenant.findOne({ apiKey });

    if (!tenant) {
      return res.status(401).json({ success: false, message: 'Invalid API key' });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = apiKeyAuth;
