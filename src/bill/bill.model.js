import mongoose from "mongoose";

const billchema = mongoose.Schema({
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
},{
    versionKey: false
});

export default mongoose.model('bill', billchema)