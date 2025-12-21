import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 30,
      required: [true, "請輸入城市名稱"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 設置集合名稱
citySchema.set("collection", "yfcase_city");

const City = mongoose.model("City", citySchema);

export default City;

