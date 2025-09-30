const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", userController.login);
router.post(
  "/createsection",
  upload.single("image"),
  userController.createSection
);
router.get("/getallsections", userController.getAllSections);
router.post(
  "/updatesection/:id",
  upload.single("image"),
  userController.updateSection
);
router.post("/deletesection", userController.deleteSection);

router.post(
  "/createProduct",
  upload.array("images", 10),
  userController.createProduct
);

router.post(
  "/editproduct/:id",
  upload.array("images", 10),
  userController.editProduct
);

router.get("/getallproducts", userController.getAllProducts);
router.get("/getsingleproduct/:id", userController.getSingleProduct);

router.get("/getproductsbysection/:id", userController.getProductsBySection);

router.get("/search", userController.searchProducts);
router.post("/deleteproduct", userController.deleteProduct);
module.exports = router;
