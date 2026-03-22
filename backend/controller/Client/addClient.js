const sellerModel = require("../../models/sellerModel");

const addClient = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        let image = req.file ? `uploads/${req.file.filename}` : null;   
        
        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required." });
        }
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: "Phone number must be 10 digits." });
        }
        let existingSeller = await sellerModel.findOne({ name, phone });
        if (existingSeller) {
            return res.status(400).json({ error: "Seller with this name and phone already exists." });
        }   
        // Format date → "2025-11-19"
        const today = new Date().toISOString().split("T")[0];
        const newSeller = new sellerModel({
            name,
            phone,
            address,
      
            sellerImage:image,
            seller:false,
            dateAdded: today
        });

        await newSeller.save();

        res.json({
            success: true,
            message: "New seller added successfully.",
            seller: newSeller
        });
        
    } catch (err) {
        console.error("Error adding seller:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = addClient;