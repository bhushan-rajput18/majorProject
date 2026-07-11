import express from 'express';
const app = express();
import users from "./routes/user.js"
import posts from "./routes/post.js"
import cookieParser from 'cookie-parser';

app.use(cookieParser("secretcode"))

app.get("/getsignedcookies", (req, res) => {
    res.cookie("madeIn", "India", {signed: true})
    res.send("signed cookie sent ")
})

app.get("/varify", (req,res) => {
    console.log(req.signedCookies);
    res.send("got the signed cookies ");
})

app.get("/getcookies", (req, res) => {
    res.cookie("hello", "ronaldo")
    res.send("the cookie is here ");
})

app.get("/greet", (req,res) => {
    let { name = "man" } = req.cookies;
    res.send(`Hi ${name}`);
})

app.get("/", (req, res) => {
    console.dir(req.cookies)
    res.send("hii i am a root !")
})



app.get("/", (req, res) => {
    res.send("i am root ...")
})

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listening at port 3000")
})