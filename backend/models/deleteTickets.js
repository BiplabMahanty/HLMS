const mongoose = require("mongoose");

const deleteticketSchema = new mongoose.Schema(
    {
    shiftId:{type: mongoose.Schema.Types.ObjectId, ref: "Shift" ,required: true},
    ticketId:{type: mongoose.Schema.Types.ObjectId, ref: "Ticket" ,required: true},
    name: { type: String, required: true },
    
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
   
    amountPerNumber: { type: Number,},
    due: { type: Number, default: 0 },
    totalNumberAmount: { type: Number, default: 0 },
    totalBill: { type: Number, default: 0 },
    totalNumber:{type:Number},
    },
    { timestamps: true }
);

const DeleteTicketModel = mongoose.model("DeleteTicket", deleteticketSchema);
module.exports = DeleteTicketModel;
