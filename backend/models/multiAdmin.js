const mongoose = require("mongoose");

const multiAdminSchema = new mongoose.Schema(
  {
    ticketRate: { type: Number,},
    commissionRate: { type: Number,},
    dateAdded: { type: String, default: "",required:true,unique: true },  // 👈 REQUIRED CHANG
    sem25:{ type: String, default:""},
    sem10:{ type: String, default:""},
    sem5:{ type: String, default:""},

    sem10Num: { type: Number, default:10},
    sem5Num: { type: Number,default:5 },
    sem25Num: { type: Number, default:30},
    sem100Num: { type: Number, default:100},
    sem200Num: { type: Number, default:200},
    sem50Num: { type: Number, default:50},
  },
  { timestamps: true }
);

const MultiAdminModel = mongoose.model("MultiAdmin", multiAdminSchema);
module.exports=MultiAdminModel;