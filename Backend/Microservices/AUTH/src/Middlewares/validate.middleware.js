// src/middleware/validate.middleware.js
const ApiError = require('../utils/ApiError.js')

exports.validateSignup = (req, res, next) => {
  const { name, email, password } = req.body

  const errors = []

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Valid email is required')
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  if (errors.length > 0) {
    throw new ApiError(400, 'Validation failed', errors)
  }

  next()
}

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  next()
}