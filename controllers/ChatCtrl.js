const categoryCtrl = {
    joinChat: async (req, res) => {
        try {
            res.render('chat');
        }catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
}

module.exports = categoryCtrl;