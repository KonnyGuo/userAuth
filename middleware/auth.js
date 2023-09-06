require("dotenv").config("../.env")

const jwt = require("jsonwebtoken")
const secretTokenJWT = process.env.secretToken

exports.adminAuth = async (req, res, next)=> {
    //pull out cookie token
    const token = req.cookies.jwt
    if(token) {
        //verifies token
        jwt.verify(jwt, secretTokenJWT, (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    message: "Not authorized"
                }) 
            } else {
                    if(decodedToken.role !== "admin"){
                        return res.status(401).json({
                            message: "not authorized"
                        }) 
                    } else {
                        //move to next middleware
                        // In Express.js middleware, next() is a callback function that is used to pass control to the next middleware function in the stack. Each middleware function in Express can take three parameters: req (request), res (response), and next (a callback function).

                        // Here's how it works:
                        // When a middleware function is called, it can perform some operations or checks related to the request or response. If everything is as expected, it can then call next() to pass control to the next middleware function in the stack.

                        // If next() is not called within the current middleware function, the request can become stuck, and the subsequent middleware functions will not be executed. Therefore, it's essential to call next() when the current middleware function's tasks are complete.
                        next()
                    }
                }
        })
    } else {
        return res.status(401).json({
            message: "not authorized, token not avaliable"
        })
    }

}

exports.basicAuth = async (req, res, next)=> {
    //pull out cookie token
    const token = req.cookies.jwt
    if(token) {
        //verifies token
        jwt.verify(jwt, secretTokenJWT, (err, decodedToken) => {
            if(err){
                return res.status(401).json({
                    message: "Not authorized"
                }) 
            } else {
                    if(decodedToken.role !== "Basic"){
                        return res.status(401).json({
                            message: "not authorized"
                        }) 
                    } else {
                        next()
                    }
                }
        })
    } else {
        return res.status(401).json({
            message: "not authorized, token not avaliable"
        })
    }

}