require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const bp = require('body-parser');
const auth = require('./middleware/auth');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

// use middleware 
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', './views');
app.set('view engine', 'ejs');


// connect to mongodb 
const URI  = process.env.MONGODB_URL;
mongoose.connect(URI, (err) => {
    if(err) console.log(err);
    console.log(`Connected to MongoDB`);
})


const botName = 'VCM bot';

//get information user
var userName = "";
function getUser(req, res, next) {
    userName = req.cookies.username;
    next();
}


// run when client connects
io.on('connection', (socket) => {
    
    const user = userJoin(socket.id, userName);

    // welcome current user
    socket.emit('message', formatMessage(botName, `Welcome ${userName} to VCM chat`));

     // BroadCast when a user connects
    socket.broadcast.emit('message', formatMessage(botName,  `${userName} has join the chat`));

    // list for chatMessage
    socket.on('chat massage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.emit('chat message', formatMessage(user.username, msg));     
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`));    
        }
    });
});



app.get('/', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('refreshToken');
    res.render('index')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/chat', auth, getUser ,(req,res) => {
    res.clearCookie('username');
    res.clearCookie('refreshToken');
    res.render('chat');
});

// Routes
app.use('/user', require('./routes/userRouter'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})