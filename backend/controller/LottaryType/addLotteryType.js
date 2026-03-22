const LotteryTypeModel = require("../../models/lotteryType");

const addLotteryType = async (req, res) => {
  try {
    const { name, returnEnd } = req.body;

    // 🔴 Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Lottery type name is required"
      });
    }

    // 🔴 Prevent duplicate name
    const exist = await LotteryTypeModel.findOne({ name });
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "Lottery type already exists"
      });
    }

    const lotteryType = await LotteryTypeModel.create({
      name,
      returnEnd
    });

    return res.status(201).json({
      success: true,
      message: "Lottery type added successfully",
      data: lotteryType
    });

  } catch (error) {
    console.error("Add Lottery Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { addLotteryType };
