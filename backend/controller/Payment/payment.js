const SellerModel = require("../../models/sellerModel");
const PaymentModel = require("../../models/payment");
const ShiftModel = require("../../models/shift");

const paymentDay = async (req, res) => {
  try {
    const {
      sellerId,
      typeMorningId,
      typeDayId,
      typeNightId,
      amountPaid = 0,
      paymentMethod,
      note,
      vouter = 0,
      today,

    } = req.body;

    /* ---------------- SELLER ---------------- */
    const seller = await SellerModel.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }
    if(!typeMorningId || !typeDayId || !typeNightId){
      return res.status(400).json({ error: "All shift type IDs (morning, day, night) are required." });
    }

    /* ---------------- DATE ---------------- */
    const todayDate = new Date(today);
    // const today = todayDate.toISOString().split("T")[0];

    /* ---------------- FIND PREVIOUS DUE (MAX 30 DAYS BACK) ---------------- */
    let previousDue = 0;
    let checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - 1);

    let attempts = 0;
    while (attempts < 30) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const oldPayment = await PaymentModel.findOne({
        sellerId: sellerId,
        dateAdded: dateStr
      });

      if (oldPayment) {
        previousDue = oldPayment.remainingDue;
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
      attempts++;
    }

    /* ---------------- TODAY SELL (SHIFT BASED) ---------------- */
    const morningShift = typeMorningId ? await ShiftModel.findOne({
      sellerId,
      lotteryTypeId: typeMorningId,
      dateKey: today
    }) : null;

    const dayShift = typeDayId ? await ShiftModel.findOne({
      sellerId,
      lotteryTypeId: typeDayId,
      dateKey: today
    }) : null;

    const nightShift = typeNightId ? await ShiftModel.findOne({
      sellerId,
      lotteryTypeId: typeNightId,
      dateKey: today
    }) : null;

    const todayBill =
      (morningShift?.sellTickets?.totalNumberAmount || 0) +
      (dayShift?.sellTickets?.totalNumberAmount || 0) +
      (nightShift?.sellTickets?.totalNumberAmount || 0);

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
    if(morningShift){
      morningShift.takenForPayment=true;
      await morningShift.save();
    }
    if(dayShift){
      dayShift.takenForPayment=true;
      await dayShift.save();
    } 
    if(nightShift){
      nightShift.takenForPayment=true;
      await nightShift.save();
    } 
    

    /* ---------------- UPDATE PAYMENT ---------------- */
    payment.amountHistory.push(amountPaid);
    
    payment.paymentMethod = paymentMethod || payment.paymentMethod;
    payment.note = note || payment.note;

    payment.todayBill = todayBill;
    payment.previousDue = previousDue;

    payment.amountPaid += Number(amountPaid);
    payment.vouter += Number(vouter);

    payment.totalAmount = todayBill + previousDue;

    payment.remainingDue =
      payment.totalAmount - payment.amountPaid - payment.vouter;

    if (payment.remainingDue < 0) {
      payment.remainingDue = 0;
    }

    payment.todayRemaining = payment.remainingDue;

    /* ---------------- SAVE ---------------- */
    await payment.save();

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: {
        seller: seller.name,
        date: today,
        todayBill,
        amountPaid: payment.amountPaid,
        voucher: payment.vouter,
        totalAmount: payment.totalAmount,
        remainingDue: payment.remainingDue
      }
    });

  } catch (err) {
    console.error("Payment Day Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
};

module.exports = paymentDay;
