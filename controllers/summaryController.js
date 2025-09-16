

const summary = async (req, res) => {
    try {
        res.status(200).json({
            message: "ye lo API ka data",
            ...req.body,
        });

    } catch (error) {
        console.error('Error processing request:', error.message);
        
        res.status(500).json({ error: 'Server could not complete the request. Please try again later.' });
    }
};

module.exports = { summary };