const LotteryTypeModel = require("../../models/lotteryType");

const updateLotteryType = async (req, res) => {
  try {
    const { id, name, returnEnd } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: "ID and name are required"
      });
    }

    const existingType = await LotteryTypeModel.findOne({ name, _id: { $ne: id } });
    if (existingType) {
      return res.status(409).json({
        success: false,
        message: "Lottery type name already exists"
      });
    }

    const updated = await LotteryTypeModel.findByIdAndUpdate(
      id,
      { name, returnEnd },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Lottery type not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lottery type updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("Update Lottery Type Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { updateLotteryType };
