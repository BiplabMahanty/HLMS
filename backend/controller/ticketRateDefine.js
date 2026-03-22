const MultiAdmin=require('../models/multiAdmin')

const ticketRateDefine=async(req,res)=>{ 
    try {
        const {ticketRate}=req.body;
        const setTicketRate=await MultiAdmin.findOne({commissionRate:10})

        setTicketRate.ticketRate=ticketRate;
        await setTicketRate.save();
        res.status(200).json({
            success:true,
            message:"Ticket Rate Set Successfully",
            data:setTicketRate
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
module.exports={ticketRateDefine}