
const { database } = require('../../config.js');
const { ObjectId } = require('mongodb');
const mailer = require('../../utils/mailer.js');
const bcrypt = require('bcrypt');

const registerAccount = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const pass = req.body.pass
        const USERS = database.collection('USERS');
        const foundUser = await USERS.findOne({ email: email });
        if (foundUser) {
            res.send('Email đã tồn tại!')
        } else {
            const registrationToken = await bcrypt.hash(email, 10);
            const hashedPass = await bcrypt.hash(pass, 10);
            const newUser = {
                username: name,
                email: email,
                password: hashedPass,
                role: 'user',
                confirm_status: 0
            };
            const insertResult = await USERS.insertOne(newUser)
            mailer.sendMail(
                email,
                "Xác nhận đăng ký tài khoản website wedding dress",
                `
                <p>Nhấn vào link bên dưới để xác nhận đăng ký tài khoản</p>
                <a href="http://localhost:7000/auth/confirm/${email}?registrationToken=${registrationToken}">Xác nhận đăng ký</a>
                `
            );
            res.json({ success: true, msg: 'Vui lòng vào mail để xác thực tài khoản.' });
        }

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function confirmRegister(req, res) {
    const email = req.params.email;
    const registrationToken = req.query.registrationToken;
    const USERS = database.collection('USERS');
    const foundUser = await USERS.findOne({ email: email });
    if (!foundUser) {
        res.json({ success: false, msg: 'Email not found!' })
    }
    bcrypt.compare(email, registrationToken, async (err, result) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'registrationToken invalid!' })
        }
        else {
            const updatedUser = {
                confirm_status: 1
            };

            // Thực hiện cập nhật trong cơ sở dữ liệu
            const result = await USERS.updateOne(
                { email: email }, // Điều kiện tìm kiếm người dùng cần cập nhật
                { $set: updatedUser }           // Dữ liệu mới cần cập nhật
            );

            // Kiểm tra xem có người dùng nào được cập nhật không
            if (result.modifiedCount > 0) {
                // Nếu có người dùng được cập nhật, trả về thông báo thành công
                res.json({ success: true, msg: 'User updated successfully' });
            } else {
                // Nếu không tìm thấy người dùng cần cập nhật, trả về thông báo lỗi
                res.status(404).json({ success: false, msg: 'User not found' });
            }
        }
    })

}

const loginAccount = async (req, res) => {
    try {
        const { email, pass } = req.body
        const USERS = database.collection('USERS');
        const foundUser = await USERS.findOne({ email: email });
        if (foundUser) {
            console.log(foundUser);
            if (foundUser.confirm_status !== 1) {
                res.json({
                    success: false, msg:
                        `Tài khoản của bạn chưa được xác thực, 
            vui lòng đường link sau để xác thực tài khoản:....` });
            }
            if (foundUser.confirm_status === 1) {
                bcrypt.compare(pass, foundUser.password, (err, data) => {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                    }
                    if (data) {
                        res.json({ success: true, msg: 'login successful' })

                    } else {
                        res.json({ success: false, msg: 'Tài khoản hoặc mật khẩu không đúng.' })
                    }
                })
            }
        } else {
            res.json({ success: false, msg: 'Email chưa được đăng ký tài khoản.' });
        }

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = { registerAccount, confirmRegister, loginAccount }
