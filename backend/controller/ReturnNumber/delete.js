const ShiftModel = require("../../models/shift");
const TicketModel = require("../../models/dallyTickets");
const DeleteTicketModel = require("../../models/deleteTickets");
const SellerModel = require("../../models/sellerModel");
const MultiAdminModel = require("../../models/multiAdmin");

const deleteNumberToSeller = async (req, res) => {
  try {
    const { sellerId, lotteryTypeId, startNumber, endNumber, category,today } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!sellerId || !lotteryTypeId || !category || startNumber == null || endNumber == null||!today) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (String(startNumber).length !== 5) {
      return res.status(400).json({ error: "ঠিক করে লেখো।" });
    }

    const validCategories = [
      "thirtySem",
      "fiveSem",
      "tenSem",
      "hundredSem",
      "twoHundredSem",
      "fiftySem"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "অবৈধ বিভাগ" });
    }

    const admin = await MultiAdminModel.findOne();
    if (!admin) {
      return res.status(400).json({ error: "Admin settings not found." });
    }

    // const today = new Date().toISOString().split("T")[0];

    /* ---------------- NUMBER RANGE ---------------- */
    const pad5 = (n) => n.toString().padStart(5, "0");

    let start = Number(pad5(startNumber));
    let end = Number(pad5(endNumber));

    if (end < start) {
      end = Number(
        pad5(startNumber.toString().slice(0, 3) + endNumber.toString().padStart(2, "0"))
      );
    }

    const numbers = [];
    for (let i = start; i <= end; i++) numbers.push(i);

    /* ---------------- FIND SHIFT ---------------- */
    const shift = await ShiftModel.findOne({
      sellerId,
      lotteryTypeId,
      dateKey: today
    });
    console.log("shift", {sellerId,lotteryTypeId,today})

    if (!shift) {
      return res.status(404).json({ error: "Shift not found." });
    }

    //* ---------------- FIND TICKET ---------------- */
    const allTicket = await TicketModel.findOne({
      shiftId: shift._id,
      dateAdded: today
    });
    if (!allTicket  ) {
      return res.status(400).json({ error: "No tickets found in this category." });
    }
    const ticket=shift.sellTickets
    console.log("ticket",ticket)
    if (!ticket || !Array.isArray(ticket[category])) {
      return res.status(400).json({ error: "No selltickets found in this category." });
    }

    /* ---------------- MISSING CHECK ---------------- */
    const missing = numbers.filter(n => !ticket[category].includes(n));
    if (missing.length > 0) {
      return res.status(400).json({
        error: "এই টিকিটগুলো বিক্রেতার কাছে নেই",
        missingNumbers: missing
      });
    }

    /* ---------------- DELETE DOC ---------------- */
    let deleteDoc = await DeleteTicketModel.findOne({
      shiftId: shift._id,
      ticketId: allTicket._id,
      dateAdded: today
    });

    if (!deleteDoc) {
      deleteDoc = new DeleteTicketModel({
        shiftId: shift._id,
        ticketId: allTicket._id,
        name: shift.name,
        dateAdded: today,
        amountPerNumber:admin.ticketRate,
        thirtySem: [],
        fiveSem: [],
        tenSem: [],
        hundredSem: [],
        twoHundredSem: [],
        fiftySem: []
      });
    }

    /* ---------------- DUPLICATE DELETE CHECK ---------------- */
    const alreadyDeleted = numbers.filter(n => deleteDoc[category].includes(n));
    if (alreadyDeleted.length > 0) {
      return res.status(400).json({
        error: "কিছু সংখ্যা আগেই ফেরত দেওয়া হয়েছে",
        alreadyDeleted
      });
    }

    /* ---------------- APPLY DELETE ---------------- */
    deleteDoc[category].push(...numbers);

    ticket[category] = ticket[category].filter(n => !numbers.includes(n));

    /* ---------------- RECALCULATE ---------------- */
    const calcTotal = (doc) =>
      doc.thirtySem.length * admin.sem25Num +
      doc.fiveSem.length * admin.sem5Num +
      doc.tenSem.length * admin.sem10Num +
      doc.hundredSem.length * admin.sem100Num +
      doc.twoHundredSem.length * admin.sem200Num +
      doc.fiftySem.length * admin.sem50Num;

    deleteDoc.totalNumber = calcTotal(deleteDoc);
    deleteDoc.totalNumberAmount = deleteDoc.totalNumber * admin.ticketRate;

    ticket.totalNumber = calcTotal(ticket);
    ticket.totalNumberAmount = ticket.totalNumber * admin.ticketRate;

    await deleteDoc.save();
    await shift.save();

    return res.status(200).json({
      success: true,
      message: "Numbers deleted successfully",
      deletedNumbers: numbers
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = deleteNumberToSeller;
