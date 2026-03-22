const MultiAdminModel = require("../models/multiAdmin");

/**
 * POST : Add Multi Admin Data
 */
const addMultiAdmin = async (req, res) => {
  try {
    const {
      ticketRate,
      commissionRate,
      dateAdded,
      sem25,
      sem10,
      sem5,
      sem10Num,
      sem5Num,
      sem25Num,
      sem100Num,
      sem200Num,
      sem50Num,
    } = req.body;

    // 🔴 Validation
    if (!dateAdded) {
      return res.status(400).json({
        success: false,
        message: "dateAdded is required",
      });
    }

    // 🔴 Check duplicate date
    const alreadyExist = await MultiAdminModel.findOne({ dateAdded });
    if (alreadyExist) {
      return res.status(409).json({
        success: false,
        message: "Data for this date already exists",
      });
    }

    // ✅ Create document
    const newData = await MultiAdminModel.create({
      ticketRate,
      commissionRate,
      dateAdded,
      sem25,
      sem10,
      sem5,
      sem10Num,
      sem5Num,
      sem25Num,
      sem100Num,
      sem200Num,
      sem50Num,
    });

    return res.status(201).json({
      success: true,
      message: "MultiAdmin data added successfully",
      data: newData,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addMultiAdmin };
