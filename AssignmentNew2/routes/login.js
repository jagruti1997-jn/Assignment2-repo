const express = require("express");
const User = require("../Modules/user")
const post = require("../Modules/post1")
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const secret='RESTAPI'
const router = express.Router()
router.post("/login", body("email").isEmail(), body("password"), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {email, password } = req.body;
        const data=await User.findOne({email})
        if(!data){
            return res.status(400).json({
                status:"failed",
                message: "user is not registered"
            })
        }
        bcrypt.compare(password,data.password,function(err,result){ // hash=user.password
                if(err){
                    res.status(500).json({
                        status: "failed",
                        message: e.message
                    })
                }
                if(result){
                    const token=jwt.sign({
                        exp: Math.floor(Date.now()/1000)+(60*60),
                        user:data._id
                    },secret)
                    res.json({
                        status :  "success" ,
                        token
                    })
                }
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})
module.exports = router;