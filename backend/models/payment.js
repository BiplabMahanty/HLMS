const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    deleteTicketId: { type: mongoose.Schema.Types.ObjectId, ref: "DeleteTicket" },
   
    amountHistory: [{type:Number}],
    // 💰 Payment info
    amountPaid: { type: Number, required: true,default:0 },
    paymentMethod: {
      type: String,
      // enum: ["Cash", "UPI", "Bank Transfer", "Card", "Other","panding"],
      default: "panding",
    },
    

    todayBill:{type:Number,default:0},
    // optional: UPI/Bank transaction reference
    note: { type: String, trim: true },

    totalAmount:{type:Number,default:0},
    todayRemaining:{type:Number,default:0},


    vouter:{type:Number,default:0},

    // 🧾 Accounting
    previousDue: { type: Number, default: 0 },
    remainingDue: { type: Number, default: 0 },
    paymentDate: { type: Date, default: Date.now },

    dateAdded: { type: String, default: "" ,required:true},  // 👈 REQUIRED CHANGE

    // 🔒 Who recorded this payment
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    inActive:{
      type:Boolean,

    }
  },
  { timestamps: true } // ✅ createdAt & updatedAt
);

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports=PaymentModel;