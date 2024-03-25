const express = require('express');
const { getUser, getUserProfile, addNewUser, deleteUser, editUser } = require('../controller/userController')

// Tạo một router mới từ Express
const userRouter = express.Router();

userRouter.get('/', getUser);
userRouter.get('/:id', getUserProfile);
userRouter.post('/insert', addNewUser);
userRouter.put('/edit/:id', editUser);
userRouter.delete('/delete/:id', deleteUser);

// Export router để sử dụng ở nơi khác trong ứng dụng
module.exports = userRouter;
