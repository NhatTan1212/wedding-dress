const express = require('express');
const { registerAccount, confirmRegister, loginAccount } = require('../controller/auth_controller/register');

// Tạo một router mới từ Express
const authRoute = express.Router();

authRoute.post('/requireregister', registerAccount);
authRoute.get('/confirm/:email', confirmRegister)

authRoute.post('/requirelogin', loginAccount);


// Export router để sử dụng ở nơi khác trong ứng dụng
module.exports = authRoute;
