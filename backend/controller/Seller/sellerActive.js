const seller = require('../../models/sellerModel');

const sellerActive = async (req, res) => {
    try {
        const { id } = req.params;  
        const sellerData = await seller.findById(id);
        if (!sellerData) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        if (sellerData.active == false) {
            sellerData.active = true;
        } else {
            sellerData.active = false;
        }
        await sellerData.save();
        res.status(200).json({ message: `Seller ${sellerData.active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error toggling seller active status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
};

module.exports = sellerActive;