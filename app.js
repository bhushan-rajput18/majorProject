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

// getting following from routes folder
import listings from "./routes/listing.js"
import reviews from "./routes/review.js"

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

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//needed to acquire route files
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

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