const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/findUser", AdminController.findUsers);
router.post("/newUser", AdminController.newUser);
router.post("/updateUser", AdminController.updateUser);

module.exports = router;
