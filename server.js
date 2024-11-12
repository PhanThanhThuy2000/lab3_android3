const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Khởi động server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

// Kết nối MongoDB
const uri = 'mongodb+srv://admin:i7UdoowxakD6Kpsj@cluster0.zb6gn.mongodb.net/Lab3';
const mongoose = require('mongoose');
const CarModel = require('./carModel');

// Lấy danh sách xe
app.get('/', async(req, res) => {
    await mongoose.connect(uri);
    let cars = await CarModel.find();
    console.log(cars);
    res.send(cars);
});

// Tạo mới xe
app.post('/create', async(req, res) => {
    await mongoose.connect(uri);
    let car = req.body;
    let kq = await CarModel.create(car);
    console.log(kq);
    let cars = await CarModel.find();
    res.send(cars);
});

// Xóa xe theo ID
app.delete('/delete/:id', async(req, res) => {
    await mongoose.connect(uri);
    let id = req.params.id;
    console.log(`ID xe cần xóa: ${id}`);

    try {
        // Thực hiện xóa xe
        const result = await CarModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            res.status(404).send({ message: "Không tìm thấy xe với ID này" });
        } else {
            res.send({ message: "Xóa xe thành công", id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Lỗi khi xóa xe", error });
    }
});

// Cập nhật xe theo ID
app.put('/update/:id', async(req, res) => {
    await mongoose.connect(uri);
    let id = req.params.id;
    let updateData = req.body;

    console.log(`ID xe cần cập nhật: ${id}`);
    console.log(`Dữ liệu cập nhật:`, updateData);

    try {
        const result = await CarModel.updateOne({ _id: id }, updateData);
        if (result.matchedCount === 0) {
            res.status(404).send({ message: "Không tìm thấy xe với ID này" });
        } else {
            res.send({ message: "Cập nhật xe thành công", id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Lỗi khi cập nhật xe", error });
    }
});