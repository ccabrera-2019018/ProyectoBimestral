import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name already exists'],
        required: [true, 'name is required']
    },
    description: {
        type: String,
        required: false
    },
}, {
    versionKey: false
})

export default mongoose.model('category', categorySchema)