const { MongoClient } = require('mongodb');
require('dotenv').config();

// URL kết nối đến MongoDB
const uri = process.env.MONGODB_CONN;

// Khởi tạo một đối tượng MongoClient
const mongoClient = new MongoClient(uri);

const database = mongoClient.db('QUANLYBANLAPTOP');

module.exports = { mongoClient, database };
