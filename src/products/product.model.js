import {Schema, model} from "mongoose";


const productSchema = Schema({
    name: {
        type: String,
        unique: [true, 'Name is duplicate'],
        required: [true, 'Name is required']
    },
    stock: {
        type: String,
        required: [true, 'stock is required']
    },
    price: {
        type: Number,
        min: [0, 'Place correct price, price cannot be negative'],
        required: [true, 'Price is required']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'Category is required']
    },
    sold: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
})

export default model('Product', productSchema)