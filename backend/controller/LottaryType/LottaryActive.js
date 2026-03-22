const LottaryType = require('../../models/lotteryType');

const lottaryActive = async (req, res) => {
    try {
        const { id } = req.params;  
        const lottaryData = await LottaryType.findById(id);
        if (!lottaryData) {
            return res.status(404).json({ message: 'lottary not found' });
        }
        if (lottaryData.active == false) {
            lottaryData.active = true;
        } else {
            lottaryData.active = false;
        }
        await lottaryData.save();
        res.status(200).json({ message: `lottary ${lottaryData.active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error toggling lottary active status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
};

module.exports = lottaryActive;