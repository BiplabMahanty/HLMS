const SellerModel = require("../models/sellerModel");
const PaymentModel = require("../models/payment");
const ShiftModel = require("../models/shift");

const paymentBluePrint = async (req, res) => {
  try {
    const { sellerId, typeNightId, typeDayId, typeMorningId } = req.body;

    /* ---------------- SELLER ---------------- */
    const seller = await SellerModel.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    /* ---------------- DATE ---------------- */
    const todayDate = new Date();
    const today = todayDate.toISOString().split("T")[0];

    /* ---------------- FIND PREVIOUS DUE (MAX 30 DAYS) ---------------- */
    let previousDue = 0;
    let checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - 1);

    let attempts = 0;
     let number=0
    while (attempts < 30) {
      const dateStr = checkDate.toISOString().split("T")[0];
       
      const oldPayment = await PaymentModel.findOne({
        sellerId: seller._id,
        dateAdded: dateStr
      });
      console.log("number",number)
    //   // ❌ No record → stop
    //   if (!oldPayment) {
    //     previousDue = 0;
    //     break;
    //   }

      // ✅ Valid day found (remainingDue !== -1)
      if (oldPayment) {
        previousDue = oldPayment.remainingDue;
        break;
      }
       console.log("number",number)

      // ⏪ Go back one day
      checkDate.setDate(checkDate.getDate() - 1);
      attempts++;
      number++
    }
    console.log("today",today)
    /* ---------------- TODAY SELL ---------------- */
    const sellMorning = await ShiftModel.findOne({
      sellerId: seller._id,
      lotteryTypeId: typeMorningId,
      dateKey: today
    });
     console.log("sellMorning",sellMorning)

    const sellDay = await ShiftModel.findOne({
      sellerId: seller._id,
      lotteryTypeId: typeDayId,
      dateKey: today
    });
     console.log("sellDay",sellDay)

    const sellNight = await ShiftModel.findOne({
      sellerId: seller._id,
      lotteryTypeId: typeNightId,
      dateKey: today
    });
     console.log("sellNight",sellNight)
    const todayBill =
      (sellMorning?.sellTickets?.totalNumberAmount || 0) +
      (sellDay?.sellTickets?.totalNumberAmount || 0) +
      (sellNight?.sellTickets?.totalNumberAmount || 0);
    
      console.log("todayBill",todayBill)

    /* ---------------- PAYMENT ---------------- */
    let payment = await PaymentModel.findOne({
      sellerId: seller._id,
      dateAdded: today
    });

    if (!payment) {
      payment = new PaymentModel({
        sellerId: seller._id,
        dateAdded: today,
        amountPaid: 0
      });
    }

    /* ---------------- CALCULATIONS ---------------- */
    payment.previousDue = previousDue;
    payment.todayBill = todayBill;

    payment.totalAmount = previousDue + todayBill;
    payment.remainingDue = payment.totalAmount - payment.amountPaid;

    if (payment.remainingDue < 0) {
      payment.remainingDue = 0;
    }

    payment.todayRemaining = payment.remainingDue;

    /* ---------------- SAVE ---------------- */
    await payment.save();

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      message: "Payment blueprint generated successfully",
      data: {
        seller: seller.name,
        date: today,
        previousDue,
        todayBill,
        amountPaid: payment.amountPaid,
        totalAmount: payment.totalAmount,
        remainingDue: payment.remainingDue
      }
    });

  } catch (err) {
    console.error("Payment Blueprint Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
};

module.exports = paymentBluePrint;
