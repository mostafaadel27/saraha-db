import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    fName: String,
    lastName: String,
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    age: Number,
    confirmEmail: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        default: "Male",
        enum: ['Male', 'Female']
    },
    profilePic: String,
    coverPic: Array,
    online: {
        type: Boolean,
        default: false
    },
    lasSeen: Date,
    code:String

}, {
    timestamps: true
})
export const userModel =
 mongoose.model('User', userSchema)