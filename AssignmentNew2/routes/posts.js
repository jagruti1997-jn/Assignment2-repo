const express = require("express");
const User = require("../Modules/user")
const Post = require("../Modules/post1")
const bodyparser = require("body-parser");
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()
const secret = 'RESTAPI'
router.get("/", async (req, res) => {
    const posts = await Post.find({ user: req.user });
    res.json({
        status: "success",
        posts
    })
})
router.post("/", async (req, res) => {
    const posts = await Post.create({
        title: req.body.title,
        body: req.body.body,
        user: req.user
    });
    res.json({
        status: "success",
        posts
    })
})
router.put("/:id", async (req, res) => {
    try {
        const posts = await Post.updateOne({ _id: req.params.id }, { body: req.body.body }, { runValidators: true });
        res.json({
            status: "success",
            posts
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})
// router.patch("/:id", async (req, res) => {
//     try {
//         const posts = await Post.updateOne({ _id: req.params.id }, { image: req.body.image }, { runValidators: true });
//         res.json({
//             status: "success",
//             posts
//         })
//     } catch (e) {
//         res.status(500).json({
//             status: "failed",
//             message: e.message
//         })
//     }
// })
router.delete("/:id", async (req, res) => {
    try {
        const posts = await Post.deleteOne({ _id: req.params.id });
        res.json({
            status: "success",
            posts
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})
module.exports = router;