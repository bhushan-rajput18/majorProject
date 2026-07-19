import dotenv from 'dotenv';
if(process.env.NODE_ENV != "production") {
    dotenv.config();
}


//most imp
import express from 'express';
import ejsMate from 'ejs-mate';
const app = express();
const port = 8080;
import { fileURLToPath } from 'url';
import path from 'path';
import  methodOverride  from 'method-override';
import ExpressError from "./utils/ExpressError.js";
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from "./models/user.js"

// getting following from routes folder
import listingRouter from "./routes/listing.js"
import reviewRouter from "./routes/review.js"
import userRouter from "./routes/user.js"

//needed for above to run smoothly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//connecting mongoose
import mongoose from 'mongoose';
import { register } from 'module';

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => { 
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
//....................................................

const sessionOptions = {
    secret: "mysupersecret",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.get("/", (req, res) => {
    res.send("getting req");
});


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// //demo user
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "bhavrao@123",
//         username: "bhavrao patil",
//     })

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })


//needed to acquire route files
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something is wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log(`app is listening at ${port}`)
})