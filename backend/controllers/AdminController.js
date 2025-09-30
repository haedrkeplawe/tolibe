const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const findUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

const newUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }
    const exists = await UserModel.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "المستخدم موجود بالفعل" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, password: hashedPassword });
    await user.save();
    res.status(201).json([{ _id: user._id, name: user.name }]);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }
    const exists = await UserModel.findOne({ name });
    if (!exists) {
      return res.status(409).json({ message: "المستخدم غير موجود موجود " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate({ name }, { password: hashedPassword });

    return res.status(200).json({ message: "تم التعديل بنجاح" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

module.exports = { findUsers, newUser, updateUser };
