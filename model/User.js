const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        default: "Basic",
        required: true
    }
})