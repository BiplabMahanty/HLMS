const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
    shiftId:{type: mongoose.Schema.Types.ObjectId, ref: "Shift" ,required: true},
    deleteTicket:{type: mongoose.Schema.Types.ObjectId, ref: "DeleteTicket" },
  
    
    thirtySem: [Number],
    fiveSem: [Number],
    tenSem: [Number],
    hundredSem:[Number],
    twoHundredSem:[Number],
    fiftySem:[Number],

    totalThirtySem: {type:Number},
    totalFiveSem: {type:Number},
    totalTenSem: {type:Number},
    totalhundredSem: {type:Number},
    totaltwoHundredSem: {type:Number},
    totalfiftySem: {type:Number},

    dateAdded: { type: String, default: "" ,required:true},  
   
    amountPerNumber: { type: Number, },
    due: { type: Number, default: 0 },
    totalNumberAmount: { type: Number, default: 0 },
    totalBill: { type: Number, default: 0 },
    totalNumber:{type:Number},
    },
    { timestamps: true }
);

const TicketModel = mongoose.model("Ticket", ticketSchema);
module.exports = TicketModel;
