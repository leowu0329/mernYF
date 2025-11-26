import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入姓名'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '請輸入電子郵件'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '請輸入有效的電子郵件地址']
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  workArea: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  birthday: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: [6, '密碼至少需要6個字符']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
