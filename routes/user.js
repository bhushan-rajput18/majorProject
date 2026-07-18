import express from 'express';
const router = express.Router();
import User from "../models/user.js"
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import userController from "../controllers/users.js";

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(userController.renderSignup))

//login
router.get("/login", userController.renderLoginForm)

router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login",
        failureFlash: true
    }),userController.login)

router.get("/logout", userController.logout)

export default router;