const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const categoryModel = require("../models/categoryModel");
const { v2 } = require("cloudinary");
const productModel = require("../models/productModel");

const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبه" });
    }
    const userexis = await userModel.findOne({ name });

    if (!userexis) {
      return res
        .status(401)
        .json({ message: "اسم المستخدم او كلمه السر غير صحيحه" });
    }
    const isPasswordCurrect = bcrypt.compareSync(password, userexis.password);

    if (!isPasswordCurrect) {
      return res
        .status(401)
        .json({ message: "اسم المستخدم او كلمه السر غير صحيحه" });
    }
    return res.status(200).json({ _id: userexis._id, name });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error", error });
  }
};

const createSection = async (req, res) => {
  try {
    const { name, userId } = req.body;
    let { img } = req.body;

    const isCategoryExist = await categoryModel.findOne({ name });
    if (isCategoryExist) {
      return res.status(400).json({ error: " اسم هذا الصنف مستخدم بالفعل" });
    }

    if (img) {
      const uploadedResponse = await v2.uploader.upload(img);
      img = {
        secure_url: uploadedResponse.secure_url,
        public_id: uploadedResponse.public_id,
      };
    }

    const newCategory = new categoryModel({
      name,
      img,
      userId,
    });
    console.log(newCategory);

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSections = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSection = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let { img } = req.body;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(400).json({ error: "  هذا الصنف غير موجود " });
    }

    if (name) category.name = name;

    if (img) {
      // 1️⃣ حذف الصورة القديمة لو موجودة
      if (category.img && category.img.public_id) {
        try {
          await v2.uploader.destroy(category.img.public_id);
          console.log("تم حذف الصورة القديمة من Cloudinary");
        } catch (err) {
          console.error("خطأ بحذف الصورة القديمة:", err);
        }
      }
      // 2️⃣ رفع الصورة الجديدة
      const uploadedResponse = await v2.uploader.upload(img);
      img = {
        secure_url: uploadedResponse.secure_url,
        public_id: uploadedResponse.public_id,
      };
      // 3️⃣ تحديث الداتابيز
      category.img = img;
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.body;

    // نجيب الكاتيجوري من الداتابيس
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: "هذا الصنف غير موجود" });
    }

    // إذا عنده صورة نحذفها من Cloudinary
    if (category.img && category.img.public_id) {
      await v2.uploader.destroy(category.img.public_id);
    }

    // بعدين نحذف القسم نفسه من الداتابيس
    await categoryModel.findByIdAndDelete(id);

    res.status(200).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// دالة لرفع صورة واحدة على Cloudinary وترجع الرابط
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = v2.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            secure_url: result.secure_url, // 🔹 رابط الصورة النهائي
            public_id: result.public_id, // 🔹 المعرف الأساسي (مهم للحذف لاحقاً)
          });
      }
    );
    stream.end(fileBuffer);
  });
};

const createProduct = async (req, res) => {
  try {
    const { userId, name, description, price, discount, categories } = req.body;
    const newProductModel = new productModel({
      userId,
      name,
      description,
      price,
      discount: discount || 0,
      categories: categories || [],
      images: [], // 🔹 رح نخزن فيها كائنات { secure_url, public_id }
    });

    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        // 🔹 uploadToCloudinary لازم يرجع { secure_url, public_id }
        const { secure_url, public_id } = await uploadToCloudinary(file.buffer);

        // 🔹 نخزن الكائن كامل مو بس الرابط
        uploadedImages.push({ secure_url, public_id });
      }

      newProductModel.images = uploadedImages;
      console.log(newProductModel);

      await newProductModel.save();
    }

    res.status(201).json(newProductModel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, discount, categories } = req.body;

    // 1️⃣ جلب المنتج الحالي
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // 2️⃣ تحديث الحقول
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    product.discount = discount || product.discount;
    product.categories = categories || product.categories;

    // 3️⃣ معالجة الصور
    let finalImages = [];

    // ✅ التعديل: الصور القديمة المرسلة من الفرونت
    // السبب: حتى لا تُحذف الصور القديمة التي لم تُحذف من الفرونت
    const oldImages = req.body.oldImages
      ? Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages]
      : [];

    // ✅ الاحتفاظ بالصور القديمة الموجودة في DB
    const keepImages = product.images.filter((img) => {
      const url = typeof img === "string" ? img : img.secure_url;
      return oldImages.includes(url);
    });

    finalImages.push(...keepImages);

    // ✅ حذف الصور التي لم تعد موجودة
    const removedImages = product.images.filter((img) => {
      const url = typeof img === "string" ? img : img.secure_url;
      return !oldImages.includes(url);
    });

    for (const img of removedImages) {
      if (img.public_id) {
        await v2.uploader.destroy(img.public_id); // حذف من Cloudinary
      }
    }

    // ✅ رفع الصور الجديدة
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)) // { secure_url, public_id }
      );
      finalImages.push(...uploaded);
    }

    // ✅ تحديث الصور في DB
    product.images = finalImages;

    // 4️⃣ حفظ المنتج
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const getProductsBySection = async (req, res) => {
  try {
    const { id } = req.params; // بجيب ID من الرابط
    const products = await productModel
      .find({ categories: id })
      .populate("categories");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const products = await productModel.find({
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.body.id;

    // 1️⃣ جلب المنتج
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // 2️⃣ حذف الصور المرتبطة بالمنتج من Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await v2.uploader.destroy(img.public_id);
        }
      }
    }

    // 3️⃣ حذف المنتج من DB
    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "تم حذف المنتج وجميع صوره بنجاح ✅" });
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  createSection,
  getAllSections,
  updateSection,
  deleteSection,
  createProduct,
  editProduct,
  getAllProducts,
  getSingleProduct,
  getProductsBySection,
  searchProducts,
  deleteProduct,
};
