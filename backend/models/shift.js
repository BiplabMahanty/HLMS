const mongoose = require("mongoose");

/* ---------------- SELL TICKETS SUB SCHEMA ---------------- */
const sellTicketsSchema = new mongoose.Schema(
  {
    thirtySem: [Number],
    fiveSem: [Number],
    tenSem: [Number],
    hundredSem: [Number],
    twoHundredSem: [Number],
    fiftySem: [Number],

    totalThirtySem: Number,
    totalFiveSem: Number,
    totalTenSem: Number,
    totalhundredSem: Number,
    totaltwoHundredSem: Number,
    totalfiftySem: Number,

    

    amountPerNumber: { type: Number, },
    due: { type: Number, default: 0 },
    totalNumberAmount: { type: Number, default: 0 },
    totalBill: { type: Number, default: 0 },
    totalNumber: { type: Number }
  },
  { _id: false } // optional: keeps sellTickets clean
);

/* ---------------- SHIFT SCHEMA ---------------- */
const shiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },

    lotteryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LotteryType",
      required: true
    },

    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      
    },
    takenForPayment:{type:Boolean,default:false},

    dateKey: {
      type: String,
      required: true
    },

    sellTickets: sellTicketsSchema
  },
  { timestamps: true }
);

/* ---------------- UNIQUE COMPOUND INDEX ---------------- */
shiftSchema.index(
  { sellerId: 1, lotteryTypeId: 1, dateKey: 1 },
  { unique: true }
);

const ShiftModel = mongoose.model("Shift", shiftSchema);
module.exports = ShiftModel;
