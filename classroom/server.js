import express from 'express';
const app = express();
// import users from "./routes/user.js"
// import posts from "./routes/post.js"
import session from 'express-session';
import flash from 'connect-flash';
import ejsMate from 'ejs-mate';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// app.use("/users", users);
// app.use("/posts", posts);

const sessionOptions = {
    secret: "mysupersecret",
    resave: false, 
    saveUninitialized: true
}

app.use(session(sessionOptions))
app.use(flash())

//middleware
app.use((req, res, next) => {
    res.locals.messages = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous") {
        req.flash("error", "user is not registered")
    } else {
        req.flash("success", "user is registered successfully ")
    }
    
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name })
})

// app.get("/test", (req, res) => {
//     res.send("test successful");
// })

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++
//     } else {
//         req.session.count = 1;
//     }

//     res.send(` you sent request ${req.session.count} times `)
// })

app.listen(3000, () => {
    console.log("server is listening at port 3000")
})