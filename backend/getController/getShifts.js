const Shift = require("../models/shift");

const getShiftByQuery = async (req, res) => {
  try {
    const { lotteryTypeId, sellerId, dateKey } = req.body;

    if (!lotteryTypeId || !sellerId || !dateKey) {
      return res.status(400).json({
        success: false,
        message: "lotteryTypeId, sellerId and dateKey are required"
      });
    }
    console.log("Query Params:", { lotteryTypeId, sellerId, dateKey });

    const shift = await Shift.findOne({
      lotteryTypeId,
      sellerId,
      dateKey
    })
      .populate("sellerId")
      .populate("lotteryTypeId")
      .populate("ticketId");

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "No shift found for given filters"
      });
    }

    res.status(200).json({
      success: true,
      data: shift
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

module.exports=getShiftByQuery
