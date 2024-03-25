const express = require('express');
const { getProduct, addNewProduct, editProduct } = require('../controller/productController')

// Tạo một router mới từ Express
const productRoute = express.Router();

productRoute.get('/', getProduct);
// productRoute.get('/:id', getUserProfile);
productRoute.post('/insert', addNewProduct);
productRoute.put('/edit/:id', editProduct);
// productRoute.delete('/delete/:id', deleteUser);

// Export router để sử dụng ở nơi khác trong ứng dụng
module.exports = productRoute;
