const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_e_commerce_2026_dev_prod';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
