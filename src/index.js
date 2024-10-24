const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


//upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'access/uploads/'); // Thư mục lưu trữ tệp
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


//upload file backup
const backup = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'access/backup/'); // Folder to save the file
    },
    filename: function (req, file, cb) {
        // const uuid = req.body.uuid;
        // console.log(req)
        // console.log(file.originalname)
        // cb(null, uuid);
        cb(null, file.originalname);

    }


});

// Tạo instance của `multer` với cấu hình lưu trữ   
const upload = multer({ storage: storage });
// Tạo instance của `multer` với cấu hình lưu trữ backup
const uploadBackup = multer({ storage: backup });

app.use(express.static(path.join(__dirname, '../')));


const {
    createUser, getUserData, getUserById, deleteUser, updateUser, updateAdmin
} = require('./controller/AccountController');
const {
    getContentHistory, getHistoryById, createContentHistory,
    deletehistory, deleteMutipleHistory, Pin, unPin
} = require('./controller/HistoryController');
// const { getWinPrize } = require('./controller/WinprizeController');
// const { gacha, viewGacha, deleteUserGacha, deleteMultipleGacha } = require('./controller/GachaController');
const { login } = require('./controller/LoginController');
const { authenticateAdminToken, authenticateBothTokens } = require('./auth');
// const { getTicker, updateTicker } = require('./controller/TicketController');
const { getchat, getChatById, createChat, deleteChat, updateChat } = require('./controller/GroupChatController');
const { getChatUser, getChatUserById, createChatUser, deleteChatUser, updateChatUser, getUuidByAccountid } = require('./controller/GroupChatUserController');
const { getNote, getNoteById, createNote, deleteNote, updateNode } = require('./controller/NoteController');
const { getContentNote, getContentNoteById, createContentNote, deleteContentNote, updateContent, PinContentNote, unPinContentNote, PinCheckSuccess, unCheckSuccess, getContentImportant, getContentCheckSuccess } = require('./controller/ContentnoteController');
const { createBackUp } = require('./controller/BackUpController');

const { log } = require('console');

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.put('/backup', uploadBackup.single('linkbackup'), authenticateBothTokens, createBackUp);

// Define routes
app.get('/getUser', getUserData);
app.post('/createUser', createUser);
app.get('/getByUserId/:id', getUserById);
app.delete('/deleteUser/:id', authenticateAdminToken, deleteUser);
app.put('/updateUser/:id', authenticateBothTokens, updateUser);
app.put('/updateAdmin/:id', authenticateAdminToken, updateAdmin);
// app.delete('/deleteSignup/:id', deleteSignup);
// app.put('/updatesignup/:id', updateSignup);
// app.put('/ungacha/:id', authenticateAdminToken, ungacha);
// app.put('/unlockgacha/:id', authenticateAdminToken, unLockgacha);

// app.post('/gacha', authenticateAdminToken, gacha);
// app.get('/viewgacha', viewGacha);
// app.delete('/deleteGacha/:id', deleteUserGacha);
// app.delete('/deleteMultipleGacha', deleteMultipleGacha);

// app.get('/getWinPrize', getWinPrize);

app.get('/getContentcopy', authenticateAdminToken, getContentHistory);
app.post('/getContentById', authenticateBothTokens, getHistoryById);
app.post('/createContentcopy', authenticateBothTokens, createContentHistory);
app.delete('/deleteContentcopy/:id', authenticateBothTokens, deletehistory);
app.delete('/deleteMutipleByAdmin', authenticateBothTokens, deleteMutipleHistory);
app.put('/pin/:id', authenticateBothTokens, Pin);
app.put('/unpin/:id', authenticateBothTokens, unPin);

app.post('/login', login);

// app.get('/ticker', getTicker);
// app.put('/updateticker/:id', updateTicker);

app.get('/getchat', authenticateBothTokens, getchat);
app.get('/getChatById/:id', authenticateBothTokens, getChatById);
app.post('/createChat', authenticateAdminToken, upload.single('img'), createChat);
app.delete('/deleteChat/:id', authenticateAdminToken, deleteChat);
app.put('/updateChat/:id', authenticateAdminToken, upload.single('img'), updateChat);

app.get('/getChatUser', authenticateAdminToken, getChatUser);
app.post('/getUuidByAccountid', authenticateBothTokens, getUuidByAccountid);
app.post('/getChatUserById', authenticateBothTokens, getChatUserById);
app.post('/createChatUser', authenticateBothTokens, upload.single('img'), createChatUser);
app.delete('/deleteChatUser/:id', authenticateBothTokens, deleteChatUser);
app.put('/updateChatUser/:id', authenticateBothTokens, upload.single('img'), updateChatUser);

app.get('/getNote', authenticateAdminToken, getNote);
app.post('/getNoteById', authenticateBothTokens, getNoteById);
app.post('/createNote', authenticateBothTokens, createNote);
app.delete('/deleteNote/:id', authenticateBothTokens, deleteNote);
app.put('/updateNote/:id', authenticateBothTokens, updateNode);

app.get('/getContentNote', authenticateAdminToken, getContentNote);
app.post('/getContentNoteById', authenticateBothTokens, getContentNoteById);
app.post('/createContentNote', authenticateBothTokens, createContentNote);
app.delete('/deleteContentNote/:id', authenticateBothTokens, deleteContentNote);
app.put('/updateContentNote/:id', authenticateBothTokens, updateContent);
app.put('/pinContentNote/:id', authenticateBothTokens, PinContentNote);
app.put('/unpinContentNote/:id', authenticateBothTokens, unPinContentNote);
app.put('/pinCheckSuccess/:id', authenticateBothTokens, PinCheckSuccess);
app.put('/unCheckSuccess/:id', authenticateBothTokens, unCheckSuccess);
app.post('/getContentImportant', authenticateBothTokens, getContentImportant);
app.post('/getContentCheckSuccess', authenticateBothTokens, getContentCheckSuccess);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('gacha', async () => {
        // console.log("VO");
        try {
            const user = await gacha(); // Call the gacha function directly
            io.emit('gachaResult', { idwinprize: user.idwinprize, username: user.username, code: user.code, phone: user.phone });
            console.log('Gacha result emitted:', user);
        } catch (error) {
            console.error('Error during gacha:', error);
            socket.emit('error', 'An error occurred while performing gacha');
        }
    });

    // socket.on('viewGacha', async () => {
    //     try {
    //         const user = await viewGacha(); // Call the viewGacha function directly
    //         io.emit('viewGachaResult', { username: user.username, code: user.code, phone: user.phone });
    //     } catch (error) {
    //         console.error('Error during viewGacha:', error);
    //         socket.emit('error', 'An error occurred while performing viewGacha');
    //     }
    // });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log(`Server listening at https://izm1.transtechvietnam.com`);
});
