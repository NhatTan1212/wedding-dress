
const { database } = require('../config');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const getProduct = async (req, res) => {
    try {
        const PRODUCTS = database.collection('PRODUCTS');
        const products = await PRODUCTS.find().toArray();
        console.log('List of products:', products);
        res.send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

const addNewProduct = async (req, res) => {
    try {
        const { product_name, description, price, rent_cost, sewing_cost,
            product_color, dress_size, images } = req.body;

        const PRODUCTS = database.collection('PRODUCTS');

        const newProduct = {
            product_name: product_name,
            description: description,
            price: price,
            rent_cost: rent_cost,
            sewing_cost: sewing_cost,
            product_color: product_color,
            dress_size: dress_size,
            images: images
        };
        const insertResult = await PRODUCTS.insertOne(newProduct)
        const productInserted = await PRODUCTS.findOne({ _id: insertResult.insertedId });
        console.log(productInserted);
        res.json({ success: true, msg: 'new product inserted successful', newProduct: productInserted });


    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

const editProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy ID của sản phẩm từ request params
        const { product_name, description, price, rent_cost, sewing_cost,
            product_color, dress_size, images } = req.body; // Lấy thông tin mới của sản phẩm từ request body

        const PRODUCTS = database.collection('PRODUCTS');

        // Tạo một đối tượng chứa thông tin cần cập nhật
        const updatedProduct = {
            product_name: product_name,
            description: description,
            price: price,
            rent_cost: rent_cost,
            sewing_cost: sewing_cost,
            product_color: product_color,
            dress_size: dress_size,
            images: images
        };

        // Cập nhật thông tin của sản phẩm trong cơ sở dữ liệu
        const result = await PRODUCTS.updateOne(
            { _id: new ObjectId(productId) }, // Điều kiện tìm kiếm sản phẩm cần cập nhật
            { $set: updatedProduct }       // Dữ liệu mới cần cập nhật
        );
        // Kiểm tra xem có sản phẩm nào được cập nhật không
        if (result.modifiedCount > 0) {
            // Nếu có sản phẩm được cập nhật, trả về thông báo thành công và thông tin sản phẩm đã cập nhật
            res.json({ success: true, msg: 'Product updated successfully', updatedProduct });
        } else {
            // Nếu không tìm thấy sản phẩm cần cập nhật, trả về thông báo lỗi
            res.status(404).json({ success: false, msg: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getProduct, addNewProduct, editProduct }