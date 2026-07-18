import express from 'express';
const router = express.Router();
import User from "../models/user.js"
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import userController from "../controllers/users.js";

//signup & renderSignup (merge using router.route)
router.route("/signup")
 .get( (req, res) => {
    res.render("users/signup.ejs")
})
 .post( wrapAsync(userController.renderSignup)
);


//login (merge using router.route)
router.route("/login")
 .get(userController.renderLoginForm)
 .post( saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login",
        failureFlash: true
    }),userController.login
);


router.get("/logout", userController.logout)

export default router;