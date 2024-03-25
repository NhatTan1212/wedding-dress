const express = require('express');
const userRouter = require('./routes/userRoute');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute');
const { database } = require('./config');

require('dotenv').config();

const app = express();

const port = 7000;
app.listen(port, () => {
    console.log('Server is lising on port: ', port);
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Wellcome to NT Web')
})
app.get('/user2', async (req, res) => {
    try {
        const USERS = database.collection('USERS');
        const users = await USERS.find().toArray();
        console.log('List of users:', users);
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
})
app.use('/auth', authRoute);
app.use('/user', userRouter);
app.use('/product', productRoute);