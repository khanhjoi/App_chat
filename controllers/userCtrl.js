const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// password 1231331
const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body;
            const user = await Users.findOne({email});
        
            // logic store data
            if(user) {
                return res.status(400).json({msg: "The email already exits."})
            }

            if(password.length < 6) {
                return res.status(400).json({msg: "Password must be at least 6 characters long."});
            }

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name, email, password:passwordHash,
            });

            // Save user to mongoose database
            await newUser.save();

            //  then create jsonwebtoken to authentication
            const accessToken = createAccessToken({id: newUser._id});
            const refreshToken = createRefreshToken({id: newUser._id});

            // store token to cookie 
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.render('index');
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    login: async (req, res) => {
        try{
            const {email, password} = req.body;
            
            const user = await Users.findOne({email});
            if(!user) {
                return res.status(400).json({msg: "User is not exist."})
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({msg: "Incorrect Password."})
            }

            // if Login success, create access_token and refresh_token
                //  then create jsonwebtoken to authentication
             const accessToken = createAccessToken({id: user._id});
            
                // store token to cookie 
             res.cookie('refreshToken', accessToken);
             res.cookie('username', user.name);

             
             res.redirect('http://localhost:3000/chat');
        }catch (err){
            return res.status(500).json({msg: err.message});
        }
    },
    logout: async (req, res) => {
        try {
            //clear username and token
            res.clearCookie('username');
            res.clearCookie('refreshToken');
            return res.render('index');
        }catch (err){
            return res.status(500).json({msg: err.message});
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2 days'});
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '4 days'});
}

module.exports = userCtrl;