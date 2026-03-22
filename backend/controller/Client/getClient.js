const SellerModel=require("../../models/sellerModel")
const getclient = async (req, res) => {
  try {
    console.log("Fetching all admin...");

    const client = await SellerModel.find({ seller:false })
      .sort({ createdAt: -1 })
      .lean();

    if (!client || client.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No client found",
        client: [],
        count: 0,
      });
    }

    console.log(`Found ${client.length} users.`);

    res.status(200).json({
      success: true,
      message: "client fetched successfully",
      client,
      count: client.length,
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

module.exports={getclient}