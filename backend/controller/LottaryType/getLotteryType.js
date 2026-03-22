const LotteryTypeModel=require("../../models/lotteryType")
const MultiAdminModel=require("../../models/multiAdmin")
const getlotteryType = async (req, res) => {
  try {
    console.log("Fetching all admin...");

    const lotteryType = await LotteryTypeModel.find({ })
      .sort({ createdAt: -1 })
      .lean();

    if (!lotteryType || lotteryType.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No lotteryType found",
        lotteryType: [],
        count: 0,
      });
    }

    const adminData = await MultiAdminModel.findOne({})
    const amountdata = adminData?.ticketRate || 0
    console.log("Amount data:", amountdata);

    console.log(`Found ${lotteryType.length} users.`);

    res.status(200).json({
      success: true,
      message: "lotteryType fetched successfully",
      lotteryType,
      count: lotteryType.length,
      amountData: amountdata,
    });
  } catch (error) {
    console.error("❌ Error fetching admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
      error: error.message,
    });
  }
};

module.exports={getlotteryType}