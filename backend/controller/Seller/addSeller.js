const SellerModel = require("../../models/sellerModel");
const PaymentModel = require("../../models/payment");

const addSeller = async (req, res) => {
    try {
        const { name, phone, address, email ,due} = req.body;
        let image = req.file ? `uploads/${req.file.filename}` : null;

        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required." });
        }
        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: "Phone number must be 10 digits." });
        }
       
        let existingSeller = await SellerModel.findOne({ name, phone });
        if (existingSeller) {
            return res.status(400).json({ error: "Seller with this name and phone already exists." });
        }
        
        // Format date → "2025-11-19"
        const today = new Date().toISOString().split("T")[0];

        const newSeller = new SellerModel({
            name,
            phone,
            address,
            email,
            sellerImage:image,
            dateAdded: today
        });

        await newSeller.save();

        if( due > 0){
            const payment = new PaymentModel({
                sellerId: newSeller._id,
                dateAdded: today,
                previousDue: due,
                amountPaid: 0,
                vouter: 0,
                todayBill: 0,
                totalAmount: due,
                remainingDue: due,
                todayRemaining: due
            });
            await payment.save();
        }   

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
module.exports = addSeller;