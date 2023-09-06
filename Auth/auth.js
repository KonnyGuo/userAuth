const User = require("../model/User");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
//middleware to pull apart cookie, verify token and grant access to private routes
const cookieParser = require("cookie-parser")
require("dotenv").config("../.env")

//generate token using node then type require('crypto').randomBytes(35).toString('hex')
//we are adding token and cookie, sending cookie to client to be used in login process
const secretTokenJWT = process.env.secretToken
// app.use(express.urlencoded({extended:true}))
app.use(express.json());

exports.register = async (req, res, next) => {
    //double assigning, destructing
    //sending to db to create
    const { userName, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: "password less than 6 characters" });
    }

    try {
        //p1 what you want to cryot, p2 how long of a salt value (random gen)
        const hash = await bcrypt.hash(password, 10)
        //creates a user
        const user = await User.create({
            userName,
            password: hash,
        });
        //in seconds
        const maxAge = 3 * 60 * 60
        // This part generates a JSON Web Token (JWT) using the jsonwebtoken library. The jwt.sign() function takes three arguments:

        // The first argument is an object containing data you want to include in the token. Here, you're including the id, userName, and role of the user.
        // The second argument is the secret key (secretTokenJWT) used to sign the token.
        // The third argument is an options object specifying the token's expiration time (expiresIn).
        const token = jwt.sign(
            {
                id: user._id,
                userName,
                role: user.role
            },
            secretTokenJWT,
            {
                expiresIn: maxAge
            }
        )
        //name and value
        // This part sets an HTTP cookie named 'jwt' with the JWT token you just generated. The res.cookie() function is typically used in web applications to store session information or tokens. The options object passed as the third argument specifies that the cookie is HTTP-only (not accessible via JavaScript in the browser) and sets its maximum age in milliseconds.
        res.cookie('jwt', token, {
            httpOnly: true,
            //value in millseconds
            // By using maxAge, you can balance the convenience of keeping users logged in for a reasonable period with the need to periodically re-authenticate for security reasons.
            // maxAge: maxAge * 1000 is used to set the maxAge property of the cookie. maxAge is defined earlier as the number of seconds (3 hours in this case), and it's converted to milliseconds by multiplying it by 1000.

            // The cookie with the name 'jwt' is set to expire after the specified maxAge in milliseconds. In this example, the cookie will expire after 3 hours (3 * 60 * 60 * 1000 milliseconds).
            maxAge: maxAge * 1000
        })

        res.status(201).json({
            message: "user successful created",
            user: user_id,
            role: user.role
        })

        //send back and talk about success
    } catch (err) {
        //1xx information, 2xx success, 3xx redirection, 4xx client error, 5xx server error
        res.status(401).json({
            message: "user creation failed",
            error: err.message,
        });
    }
};

//validate cred of existing users
exports.login = async (req, res, next) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        res.status(401).json({
            message: "userName and password empty",
        });
    }
    try {
        //check if userName exist in mongo
        const user = await User.findOne({ userName });
        if (!user) {
            res.status(401).json({
                message: "user does not exist login unsuccessful",
            });
        } else {
            //check password pass in vs salted password
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                const maxAge = 3 * 60 * 60
                const token = jwt.sign(
                    {
                        id: user._id,
                        userName,
                        role: user.role
                    },
                    secretTokenJWT,
                    {
                        expiresIn: maxAge
                    }
                )

                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000
                })

                res.status(201).json({
                    message: "user successful logged in",
                    user: user_id,
                })
            } else {
                res.status(401).json({
                    message: "failed login",
                });
            }

        }
    } catch (err) {
        res.status(401).json({
            error: err.message,
        });
    }
};

exports.update = async (req, res, next) => {
    const { role, id } = req.body;
    // Check if role and id are present
    try {
        if (role && id) {
            if (role === "admin") {
                const user = await User.findById(id);
                if (user.role !== "admin") {
                    user.role = role;
                    try {
                        const updatedUser = await user.save(); // Use async/await here
                        res.status(201).json({
                            message: "Update successful",
                            user: updatedUser, // Send back the updated user
                        });
                    } catch (err) {
                        res.status(401).json({
                            message: "Error occurred",
                            error: err.message,
                        });
                    }
                }
            } else {
                res.status(401).json({
                    message: "Role is not admin",
                });
            }
        } else {
            res.status(401).json({
                message: "Role and id are missing",
            });
        }
    } catch (err) {
        res.status(401).json({
            message: "Error",
            error: err.message,
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    try {
        const user = await User.findById(id)
        res.status(201).json({
            message: "user deleted",
            user,
        })
    } catch (err) {
        res.status(401).json({
            message: "error has occured",
            error: err.message
        })
    }
}