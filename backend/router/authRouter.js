const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/Auth/authController");
const verifyToken = require("../middlewire/authMiddleware");
const checkRole = require("../middlewire/roleMiddleware");
const upload = require("../middlewire/uploads");

router.post("/register", verifyToken, checkRole("superAdmin"), upload.single('image'), register);
router.post("/login", login);

module.exports = router;
