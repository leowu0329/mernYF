import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入姓名"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "請輸入電子郵件"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "請輸入有效的電子郵件地址"],
    },
    // Personal Information
    nickname: {
      type: String,
      maxlength: 100,
      trim: true,
      default: "",
    },
    personalId: {
      type: String,
      maxlength: 20,
      default: null,
    },

    // Contact Information
    phone: {
      type: String,
      maxlength: 20,
      trim: true,
      default: null,
    },
    mobile: {
      type: String,
      maxlength: 20,
      trim: true,
      default: null,
    },

    // Work Information
    role: {
      type: String,
      enum: ["guest", "user", "admin"],
      default: "user",
    },
    workArea: {
      type: String,
      enum: ["north", "central", "south", "kaoping"],
      default: null,
    },

    // Address Information
    city: {
      type: String,
      maxlength: 20,
      default: null,
    },
    district: {
      type: String,
      maxlength: 20,
      default: null,
    },
    village: {
      type: String,
      maxlength: 20,
      default: null,
    },
    neighbor: {
      type: String,
      maxlength: 10,
      default: null,
    },
    street: {
      type: String,
      maxlength: 50,
      default: null,
    },
    section: {
      type: String,
      maxlength: 10,
      default: null,
    },
    lane: {
      type: String,
      maxlength: 10,
      default: null,
    },
    alley: {
      type: String,
      maxlength: 10,
      default: null,
    },
    number: {
      type: String,
      maxlength: 10,
      default: null,
    },
    floor: {
      type: String,
      maxlength: 10,
      default: null,
    },
    identityType: {
      type: String,
      enum: ["public", "private"],
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minlength: [6, "密碼至少需要6個字符"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
