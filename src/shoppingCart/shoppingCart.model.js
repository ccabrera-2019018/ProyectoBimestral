import mongoose from "mongoose";

const ShoppingCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true
        }
    }],
    amountPayable: {
        type: Number,
        required: true
    }
});

export default mongoose.model('ShoppingCart', ShoppingCartSchema)