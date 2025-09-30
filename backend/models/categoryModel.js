const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    img: {
      secure_url: { type: String, required: true }, // رابط الصورة
      public_id: { type: String, required: true }, // معرف الصورة في Cloudinary
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // نوعه ObjectId
      ref: "User", // يربطها بموديل الـ User
      required: true, // لازم يكون موجود
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
