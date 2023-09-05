const express = require("express")
const app = express()
const connectDB = require("./db")

const PORT = 8000

connectDB()


const server = app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

//close server if something goes wrong
process.on("unhandledRejection", (err) => {
    console.log(`error has occur ${err.message}`)
    //close server with exit (1) which means fail, 0 means success
    server.close(() => {
        process.exit(1)
    })
})