const express = require("express")
const app = express()
const connectDB = require("./db")
const cookieParser = require("cookie-parser")
const {adminAuth, basicAuth} = require("./middleware/tokenCheck")

app.set("view engine", ejs)

const PORT = 8000

connectDB()

app.get("/", (req, res) => {res.render("home")})
app.get("/register", (req, res) => {res.render("register")})
app.get("/login", (req, res) => {res.render("login")})
app.get("/admin", adminAuth, (req, res) => {res.render("admin")})
app.get("/basic", basicAuth, (req, res) => {res.render("user")})

//when recieving reques to api/Auth go to .Auth/route middleware
app.use(express.json())
app.use("/api/Auth", require("./Auth/route"))
app.use(cookieParser())

app.get("/admin", adminAuth, (req, res) => {
    res.send("Admin route")
})
app.get("/basic", basicAuth, (req, res) => {
    res.send("basic route")
})


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