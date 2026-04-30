// src/controllers/auth.controller.js
const User = require('../model/user.model.js')
const ApiError = require('../utils/ApiError.js')
const ApiResponse = require('../utils/ApiResponse.js')
const asyncHandler = require('../utils/asyncHandler.js')

// ─── Helper: Create token and send response ───────────────────
// We extract this because both signup and login do the same thing
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken()

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  }

  // Remove password from output even though select:false handles it
  // Double safety
  user.password = undefined

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json(new ApiResponse(statusCode, { user, token }, 'Success'))
}

// ─── SIGNUP ──────────────────────────────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(400, 'Email already registered')
  }

  // Create user — password gets hashed by pre('save') middleware
  const user = await User.create({ name, email, password })

  sendTokenResponse(user, 201, res)
})

// ─── LOGIN ───────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate input exists
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password')
  }

  // Find user and explicitly include password
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    // Important: same error message for wrong email OR wrong password
    // Never tell attacker which one is wrong
    throw new ApiError(401, 'Invalid credentials')
  }

  // Check password
  const isMatch = await user.isPasswordCorrect(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials')
  }

  sendTokenResponse(user, 200, res)
})

// ─── LOGOUT ──────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0), // Expire immediately
    httpOnly: true
  })

  res.json(new ApiResponse(200, {}, 'Logged out successfully'))
})

// ─── GET CURRENT USER ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user.id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.json(new ApiResponse(200, user, 'User fetched'))
})

module.exports = {
  signup,
  login,
  logout,
  getMe
}