const sellerModel=require("../../models/sellerModel")
const getseller = async (req, res) => {
  try {
    console.log("Fetching all sellers...");

    const seller = await sellerModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    if (!seller || seller.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No seller found",
        seller: [],
        count: 0,
      });
    }

    console.log(`Found ${seller.length} sellers.`);

    res.status(200).json({
      success: true,
      message: "seller fetched successfully",
      seller,
      count: seller.length,
    });
  } catch (error) {
    console.error("❌ Error fetching sellers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
      error: error.message,
    });
  }
};

module.exports={getseller}