import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'
import { generateVerificationCode } from '../utils/generateVerificationCode.js'
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/sendEmail.js'

const router = express.Router()

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  nickname: user.nickname,
  personalId: user.personalId,
  phone: user.phone,
  mobile: user.mobile,
  role: user.role,
  workArea: user.workArea,
  identityType: user.identityType,
  birthday: user.birthday,
  city: user.city,
  district: user.district,
  village: user.village,
  neighbor: user.neighbor,
  street: user.street,
  section: user.section,
  lane: user.lane,
  alley: user.alley,
  number: user.number,
  floor: user.floor,
  isVerified: user.isVerified,
  isLoggedIn: user.isLoggedIn,
  createdAt: user.createdAt
})

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: '請填寫所有欄位' })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: '此電子郵件已被註冊' })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: '註冊成功！請檢查您的郵箱以獲取驗證碼',
      user: formatUserResponse(user)
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   POST /api/auth/verify-email
// @desc    Verify email with code
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body

    if (!email || !verificationCode) {
      return res.status(400).json({ message: '請輸入電子郵件和驗證碼' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: '此郵箱已經驗證' })
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: '驗證碼錯誤' })
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: '驗證碼已過期，請重新註冊' })
    }

    // Verify user
    user.isVerified = true
    user.verificationCode = null
    user.verificationCodeExpires = null
    await user.save()

    res.json({
      message: '郵箱驗證成功！',
      user: formatUserResponse(user)
    })
  } catch (error) {
    console.error('Verify email error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: '請輸入電子郵件和密碼' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: '無效的憑證' })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: '無效的憑證' })
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: '請先驗證您的郵箱',
        unverified: true,
        email: user.email
      })
    }

    // Update isLoggedIn status
    user.isLoggedIn = true
    await user.save()

    const token = generateToken(user._id)

    res.json({
      message: '登入成功',
      token,
      user: formatUserResponse(user)
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   GET /api/auth/verify
// @desc    Verify token and get user
// @access  Private
router.get('/verify', protect, async (req, res) => {
  try {
    res.json({
      user: formatUserResponse(req.user)
    })
  } catch (error) {
    console.error('Verify token error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (user) {
      user.isLoggedIn = false
      await user.save()
    }

    res.json({ message: '登出成功' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      // 基本資料
      name,
      email,
      nickname,
      personalId,
      phone,
      mobile,
      role,
      workArea,
      identityType,
      birthday,
      // 進階資料
      city,
      district,
      village,
      neighbor,
      street,
      section,
      lane,
      alley,
      number,
      floor,
    } = req.body

    const allowedRoles = ['guest', 'user', 'admin']
    const allowedWorkAreas = ['north', 'central', 'south', 'kaoping']
    const allowedIdentityTypes = ['public', 'private']

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' })
    }

    // 基本資料
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (nickname !== undefined) user.nickname = nickname
    if (personalId !== undefined) user.personalId = personalId
    if (phone !== undefined) user.phone = phone
    if (mobile !== undefined) user.mobile = mobile

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: '無效的權限值' })
      }
      user.role = role
    }

    if (workArea !== undefined) {
      if (workArea && !allowedWorkAreas.includes(workArea)) {
        return res.status(400).json({ message: '無效的工作轄區值' })
      }
      user.workArea = workArea || null
    }

    if (identityType !== undefined) {
      if (identityType && !allowedIdentityTypes.includes(identityType)) {
        return res.status(400).json({ message: '無效的身份類型值' })
      }
      user.identityType = identityType || null
    }

    if (birthday !== undefined) {
      user.birthday = birthday ? new Date(birthday) : null
    }

    // 進階資料
    if (city !== undefined) user.city = city || null
    if (district !== undefined) user.district = district || null
    if (village !== undefined) user.village = village || null
    if (neighbor !== undefined) user.neighbor = neighbor || null
    if (street !== undefined) user.street = street || null
    if (section !== undefined) user.section = section || null
    if (lane !== undefined) user.lane = lane || null
    if (alley !== undefined) user.alley = alley || null
    if (number !== undefined) user.number = number || null
    if (floor !== undefined) user.floor = floor || null

    await user.save()

    res.json({
      message: '個人資料已更新',
      user: formatUserResponse(user)
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send reset password link via email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: '請輸入電子郵件' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: '如果此電子郵件存在，我們已發送重設密碼連結' })
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // 1 hour
    })
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpires = resetTokenExpires
    await user.save()

    // Send reset password email with link
    try {
      // Get frontend URL from environment variable, with fallback
      let frontendUrl = process.env.FRONTEND_URL
      
      // If FRONTEND_URL is not set, try to construct from VERCEL_URL (for Vercel deployments)
      if (!frontendUrl && process.env.VERCEL_URL) {
        frontendUrl = `https://${process.env.VERCEL_URL}`
      }
      
      // Final fallback to localhost for development
      if (!frontendUrl) {
        frontendUrl = 'http://localhost:3000'
      }
      
      // Remove trailing slash if present
      const cleanFrontendUrl = frontendUrl.replace(/\/$/, '')
      const resetUrl = `${cleanFrontendUrl}/reset-password?token=${resetToken}`
      
      console.log('Reset password URL:', resetUrl) // Debug log
      await sendResetPasswordEmail(email, resetUrl)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      return res.status(500).json({ message: '發送郵件失敗，請稍後再試' })
    }

    res.json({ message: '如果此電子郵件存在，我們已發送重設密碼連結' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   GET /api/auth/verify-reset-token
// @desc    Verify reset password token
// @access  Public
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ message: '無效的重設連結' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({ message: '用戶不存在' })
      }

      if (user.resetPasswordToken !== token) {
        return res.status(400).json({ message: '無效的重設連結' })
      }

      if (user.resetPasswordTokenExpires < new Date()) {
        return res.status(400).json({ message: '重設連結已過期' })
      }

      res.json({ message: '連結有效', valid: true })
    } catch (tokenError) {
      return res.status(400).json({ message: '無效或過期的重設連結' })
    }
  } catch (error) {
    console.error('Verify reset token error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   PUT /api/auth/change-password
// @desc    Change password for logged in user
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: '請填寫所有欄位' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '密碼至少需要6個字符' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: '兩次輸入的新密碼不一致' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' })
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword)

    if (!isPasswordMatch) {
      return res.status(401).json({ message: '目前密碼錯誤' })
    }

    // Change password
    user.password = newPassword
    await user.save()

    res.json({ message: '密碼修改成功！' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: '請填寫所有欄位' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '密碼至少需要6個字符' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: '兩次輸入的密碼不一致' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({ message: '用戶不存在' })
      }

      if (user.resetPasswordToken !== token) {
        return res.status(400).json({ message: '無效的重設連結' })
      }

      if (user.resetPasswordTokenExpires < new Date()) {
        return res.status(400).json({ message: '重設連結已過期' })
      }

      // Reset password
      user.password = newPassword
      user.resetPasswordToken = null
      user.resetPasswordTokenExpires = null
      await user.save()

      res.json({ message: '密碼重設成功！請使用新密碼登入' })
    } catch (tokenError) {
      return res.status(400).json({ message: '無效或過期的重設連結' })
    }
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: '服務器錯誤' })
  }
})

export default router
