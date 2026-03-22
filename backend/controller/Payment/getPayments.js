const PaymentModel = require("../../models/payment");

const getPayments = async (req, res) => {
  try {
    const { sellerId, date } = req.query;

    if (!sellerId || !date) {
      return res.status(400).json({ error: "sellerId and date are required" });
    }

    const payments = await PaymentModel.find({
      sellerId: sellerId,
      dateAdded: date
    }).populate("sellerId", "name phone sellerImage").sort({ createdAt: -1 });
    console.log("Payments found:", payments.length);
    console.log("Payments data:", payments);
       

    return res.status(200).json({
      success: true,
      payments: payments
    });

  } catch (err) {
    console.error("Get Payments Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
};

module.exports = { getPayments };
