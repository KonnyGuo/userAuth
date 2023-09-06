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
//take in schema created and assign it to user
const User = Mongoose.model("user", UserSchema)
module.exports = User