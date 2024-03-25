const express = require('express');
const userRouter = require('./routes/userRoute');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute');

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
app.use('/auth', authRoute);
app.use('/user', userRouter);
app.use('/product', productRoute);