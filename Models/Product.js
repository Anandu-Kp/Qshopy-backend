const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Product = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    merchant_id: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("products", Product)