const PaymentModel = require("../../models/payment");

const getpreviousDate= async (req, res) => {
  try {
    const { sellerId, date } = req.query;

    if (!sellerId || !date) {
      return res.status(400).json({ error: "sellerId and date are required" });
    }
    // const priviousDate = new Date(date);
    // priviousDate.setDate(priviousDate.getDate() - 1);
    // let dateStr = priviousDate.toISOString().split("T")[0];
    // console.log("datastr",dateStr)

    // const payments = await PaymentModel.find({
    //   sellerId: sellerId,
    //   dateAdded: dateStr
    // }).populate("sellerId", "name phone sellerImage").sort({ createdAt: -1 });
    // console.log("Payments found:", payments.length);
    // console.log("Payments data:", payments);

    let preDate;
    let tempPayments ;

    for( i = 0; i < 15; i++) {
      let tempDate = new Date(date);
      tempDate.setDate(tempDate.getDate() - (i + 1));
      let tempDateStr = tempDate.toISOString().split("T")[0];
      console.log("tempDateStr", tempDateStr);
       tempPayments = await PaymentModel.find({
        sellerId: sellerId,
        dateAdded: tempDateStr
      }).populate("sellerId", "name phone sellerImage").sort({ createdAt: -1 });
      if (tempPayments.length > 0) {
        preDate = tempDateStr;
        console.log("Found payments for date:", tempDateStr);
        break;
      }
    }

    return res.status(200).json({
      success: true,
      payments: tempPayments,
    });

  } catch (err) {
    console.error("Get Payments Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
};

module.exports = { getpreviousDate };
