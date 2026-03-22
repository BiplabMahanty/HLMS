const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String },
        email: { type: String, default: "" },
        active: { type: Boolean, default: true },
        seller:{type:Boolean, default:true},
        sellerImage:{type:String},
        dateAdded: { type: String, default: "" },  // 👈 REQUIRED CHANGE
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const SellerModel = mongoose.model("Seller", sellerSchema);
module.exports = SellerModel;
