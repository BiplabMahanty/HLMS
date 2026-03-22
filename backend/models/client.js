const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        name: { type: String,  },
        // phone: { type: String,  unique: true },
        // email: { type: String, default: "" },
        active: { type: Boolean, default: true },
        

        dateAdded: { type: String, default: "" },  // 👈 REQUIRED CHANGE
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const SellerModel = mongoose.model("Seller", sellerSchema);
module.exports = SellerModel;
