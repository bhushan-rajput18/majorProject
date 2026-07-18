import Listing from "../models/listing.js";
import User from "../models/user.js";

const renderSignup = async(req, res) => {
    try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username })
    const registeredUser = await User.register(newUser, password)
    console.log(registeredUser)
    //req.login functionality of passport
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err)
        }
            req.flash("success", "Welcome to Wanderlust ")
            res.redirect("/listings")
    })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

const renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

const login = async(req, res) => { 
        req.flash("success", "welcome back to wanderlust ! ")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", "you are logged out")
        res.redirect("/listings")
    })
}

export default { renderSignup, renderLoginForm, login, logout}