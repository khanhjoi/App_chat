const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try { 
        const token = req.cookies.refreshToken;
        
        if(!token) {
            return res.render('index');
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
            if(err) {return res.status(500).json({msg: err.message});}
            
            req.user = user
            next();
        });
    } catch (err){
        return res.status(500).json({msg: err.message});
    }
}

module.exports = auth;