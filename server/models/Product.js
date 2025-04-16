const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500
    },
    category: {
        type: String,
        required: true
    },
    manufacturingDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, { timestamps: true })

ProductSchema.plugin(mongoosePaginate);

ProductSchema.index({ name: 'text', category: 1 })
ProductSchema.index({ price: 1, createdAt: -1 })

const Product = mongoose.model('Product', ProductSchema, 'products')

module.exports = Product