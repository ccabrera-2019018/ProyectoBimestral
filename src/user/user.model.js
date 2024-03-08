import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: [true, 'username already exists'],
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['ADMIN', 'CLIENT'],
        required: true
    }
}, {
    versionKey: false
})

//pre mongoose

export default mongoose.model('User', userSchema)