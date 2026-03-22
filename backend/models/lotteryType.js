const mongoose = require("mongoose");

const lotteryTypeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true ,uniqe:true},
        returnEnd:{type:String,},
        active: { type: Boolean, default: true },
        
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const LotteryTypeModel = mongoose.model("LotteryType", lotteryTypeSchema);
module.exports = LotteryTypeModel;
