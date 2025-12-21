import mongoose from "mongoose";

const townshipSchema = new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "請選擇城市"],
    },
    name: {
      type: String,
      maxlength: 30,
      required: [true, "請輸入鄉鎮名稱"],
      trim: true,
    },
    zipCode: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    districtCourt: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    landOffice: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    financeAndTaxBureau: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    policeStation: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    irs: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
    homeOffice: {
      type: String,
      maxlength: 30,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// 設置集合名稱
townshipSchema.set("collection", "yfcase_township");

const Township = mongoose.model("Township", townshipSchema);

export default Township;

