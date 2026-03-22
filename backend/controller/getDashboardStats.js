const Admin = require("../models/adminModel");
const Seller = require("../models/sellerModel");
const Payment = require("../models/payment");
const Ticket = require("../models/dallyTickets");
const DeleteTicket = require("../models/deleteTickets");

const getDashboardStats = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({ active: true });
    const totalSellers = await Seller.countDocuments({seller:true});
    const activeSellers = await Seller.countDocuments({ seller:true,active: true });
    const totalClients = await Seller.countDocuments({seller:false,active:true});
    
    const totalTickets = await Ticket.countDocuments();
    const totalDeletedTickets = await DeleteTicket.countDocuments();
    
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountPaid" },
          totalDue: { $sum: "$remainingDue" },
          totalBill: { $sum: "$totalAmount" }
        }
      }
    ]);

    const todayDate = new Date().toISOString().split('T')[0];
    const todayPayments = await Payment.aggregate([
      {
        $match: { dateAdded: todayDate }
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$amountPaid" },
          todayBill: { $sum: "$todayBill" }
        }
      }
    ]);

    const recentPayments = await Payment.find()
      .populate("sellerId", "name phone")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalAdmins,
        activeAdmins,
        totalSellers,
        activeSellers,
        totalTickets,
        totalClients,
        totalDeletedTickets,
        totalRevenue: paymentStats[0]?.totalRevenue || 0,
        totalDue: paymentStats[0]?.totalDue || 0,
        totalBill: paymentStats[0]?.totalBill || 0,
        todayRevenue: todayPayments[0]?.todayRevenue || 0,
        todayBill: todayPayments[0]?.todayBill || 0,
        recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
