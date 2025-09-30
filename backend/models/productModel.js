const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // اسم المنتج
    description: { type: String, default: "لا يوجد وصف" }, // وصف المنتج
    price: { type: Number, required: true }, // السعر الأساسي
    discount: { type: Number, default: 0 }, // نسبة أو قيمة التخفيض
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // ربط المنتج بالأصناف
      },
    ],
    images: [
      {
        secure_url: { type: String, required: true }, // رابط الصورة
        public_id: { type: String, required: true }, // معرف الصورة في Cloudinary
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId, // نوعه ObjectId
      ref: "User", // يربطها بموديل الـ User
      required: true, // لازم يكون موجود
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
