import {Schema, model} from "mongoose";


const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
}, {
    versionKey: false
})

export default model('product', productSchema)