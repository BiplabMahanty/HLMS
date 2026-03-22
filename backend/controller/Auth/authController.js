const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/adminModel");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
   let image = req.file ? `uploads/${req.file.filename}` : null;

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, email, password: hashedPassword, role: role || "admin" ,adminImage:image || ""});

    res.status(201).json({ success: true, message: "Admin registered successfully", admin: { id: admin._id, username: admin.username, role: admin.role,adminImage:admin.adminImage } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, active: true });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({ success: true, message: "Login successful", token, admin: { id: admin._id, username: admin.username, role: admin.role,adminImage:admin.adminImage } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

module.exports = { register, login };
