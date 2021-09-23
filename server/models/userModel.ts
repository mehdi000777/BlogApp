import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
        trim: true,
        maxLength: [25, "Your name is up to 20 chars long."]
    },
    account: {
        type: String,
        required: [true, "Please enter your email or phone."],
        trim: true,
        unique: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    },
    password: {
        type: String,
        required: [true, "Please enter your password."],
        trim: true
    },
    role: {
        type: String,
        default: "user" //admin
    },
    type: {
        type: String,
        default: "register" //login
    },
    rf_token: {
        type: String,
        select: false
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;