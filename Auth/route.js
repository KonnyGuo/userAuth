const express = require("express")
const router = express.Router()
const {register, login, update, deleteUser, getUsers} = require("./auth")
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/getUsers").get(getUsers)

const adminAuth = require("../middleware/auth")
//updates are put req, (crud) while the top are post
//adminAuth to protect update and delete privileges to admin
router.route("/update").put(update)
router.route("/deleteUser").delete(deleteUser)


module.exports = router
