const express = require("express")
const router = express.Router()
const {register, login, update, deleteUser} = require("./auth")
router.route("/register").post(register)
router.route("/login").post(login)
const adminAuth = require("../middleware/tokenCheck")
//updates are put req, (crud) while the top are post
//adminAuth to protect update and delete privileges to admin
router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)


module.exports = router
