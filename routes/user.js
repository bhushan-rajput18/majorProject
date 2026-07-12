import express from 'express';
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

export default router;