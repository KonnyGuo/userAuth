require("dotenv").config()
const Mongoose = require("mongoose")
const RemoteDB = process.env.connectStr

const connectDB = async() => {
    try {
        const client = await Mongoose.connect(RemoteDB)
        console.log("connection successful")
    } catch(err) {
        console.log(err.message)
    }
}

module.exports = connectDB