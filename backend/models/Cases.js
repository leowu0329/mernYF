import mongoose from "mongoose";

const casesSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      maxlength: 100,
      required: [true, "請輸入案號"],
      trim: true,
    },
    company: {
      type: String,
      maxlength: 50,
      default: null,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },
    township: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Township",
      default: null,
    },
    bigSection: {
      type: String,
      maxlength: 10,
      default: null,
    },
    smallSection: {
      type: String,
      maxlength: 10,
      default: null,
    },
    village: {
      type: String,
      maxlength: 100,
      default: null,
    },
    neighbor: {
      type: String,
      maxlength: 100,
      default: null,
    },
    street: {
      type: String,
      maxlength: 100,
      default: null,
    },
    section: {
      type: String,
      maxlength: 100,
      default: null,
    },
    lane: {
      type: String,
      maxlength: 100,
      default: null,
    },
    alley: {
      type: String,
      maxlength: 100,
      default: null,
    },
    number: {
      type: String,
      maxlength: 100,
      default: null,
    },
    floor: {
      type: String,
      maxlength: 100,
      default: null,
    },
    status: {
      type: String,
      maxlength: 10,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "請選擇區域負責人"],
    },
  },
  {
    timestamps: true, // 自動創建 createdAt 和 updatedAt
  }
);

// 設置集合名稱（如果需要對應 Django 的 db_table）
// casesSchema.set("collection", "yfcase_cases");

const Cases = mongoose.model("Cases", casesSchema);

export default Cases;

