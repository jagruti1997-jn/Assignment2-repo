const express = require("express");
const User = require("../Modules/user")
const post = require("../Modules/post1")
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const secret='RESTAPI'
const router = express.Router()
router.post("/register", body("email").isEmail(), body("name").isAlpha(), body("password").isLength({
    min: 4,
    max: 16
}), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body;
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                res.status(500).json({
                    status: "failed",
                    message: err.message
                })
            }
            const users = await User.create({
                name,
                email,
                password: hash
            });
            res.json({
                status: "success",
                message: "registration successful",
                users
            })
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})
module.exports = router;