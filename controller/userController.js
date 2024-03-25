
const { database } = require('../config');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    try {
        const USERS = database.collection('USERS');
        const users = await USERS.find().toArray();
        console.log('List of users:', users);
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const USERS = database.collection('USERS');
        const user = await USERS.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User:', user);
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
}

const addNewUser = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const pass = req.body.pass
        const USERS = database.collection('USERS');
        const foundUser = await USERS.findOne({ email: email });
        if (foundUser) {
            res.send('Email đã tồn tại!')
        } else {
            const hashedPass = await bcrypt.hash(pass, 10);
            const newUser = {
                username: name,
                email: email,
                password: hashedPass,
                role: 'user'
            };
            const insertResult = await USERS.insertOne(newUser)
            const users = await USERS.findOne({ _id: insertResult.insertedId });
            res.json(users);
        }

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.params.id; // Lấy ID của người dùng từ request params
        const { name, email, pass, role } = req.body; // Lấy thông tin mới của người dùng từ request body

        const USERS = database.collection('USERS');

        // Kiểm tra xem người dùng có tồn tại không
        const foundUser = await USERS.findOne({ _id: new ObjectId(userId) });
        if (!foundUser) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Cập nhật thông tin của người dùng
        const hashedPass = await bcrypt.hash(pass, 10);
        const updatedUser = {
            username: name,
            email: email,
            password: hashedPass,
            role: role
        };

        // Thực hiện cập nhật trong cơ sở dữ liệu
        const result = await USERS.updateOne(
            { _id: new ObjectId(userId) }, // Điều kiện tìm kiếm người dùng cần cập nhật
            { $set: updatedUser }           // Dữ liệu mới cần cập nhật
        );
        console.log(result);

        // Kiểm tra xem có người dùng nào được cập nhật không
        if (result.modifiedCount > 0) {
            // Nếu có người dùng được cập nhật, trả về thông báo thành công
            res.json({ success: true, msg: 'User updated successfully', updatedUser });
        } else {
            // Nếu không tìm thấy người dùng cần cập nhật, trả về thông báo lỗi
            res.status(404).json({ success: false, msg: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}


const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const USERS = database.collection('USERS');
        const deleteResult = await USERS.deleteOne({ _id: new ObjectId(userId) });
        if (deleteResult.deletedCount === 1) {
            return res.json({ success: true, msg: 'Xóa user thành công' });
        } else {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy user để xóa' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send('Internal Server Error');
    }
}
module.exports = { getUser, getUserProfile, addNewUser, editUser, deleteUser }
