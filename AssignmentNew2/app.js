const express=require("express");
const mongoose = require("mongoose")
const bodyparser=require("body-parser");
mongoose.connect("mongodb://localhost:27017/assignment10");
const registerRoutes=require("./routes/register")
const loginRoutes = require("./routes/login");
const postRoutes = require("./routes/posts")
const jwt = require("jsonwebtoken");
const User = require("./Modules/user");
const secret = 'RESTAPI'
const app=express();
app.use(express.json());
app.use("/api/v1/posts", (req, res, next) => {
    console.log(req.headers.authorization)
    if (req.headers.authorization) {
        const token = req.headers.authorization.split("test ")[1]
        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.status(500).json({
                    status: "failed",
                    message: "not Authenticated"
                })
            }
            console.log(err, decoded)
            const user1 = await User.findOne({ _id: decoded.user });
            req.user = user1._id;
            next();
        });
    } else {
        return res.status(500).json({
            status: "failed",
            message: "invalid token"
        })
    }
})
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1",registerRoutes)
app.use("/api/v1", loginRoutes)
app.get('*', (req, res) => {
    res.status(404).json({
        status: "Failed",
        message: "API NOT FOUND"
    })
})
app.listen(3000,()=>console.log("server is up"))