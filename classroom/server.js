import express from 'express';
const app = express();
import users from "./routes/user.js"
import posts from "./routes/post.js"

app.get("/", (req, res) => {
    res.send("i am root ...")
})

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listening at port 3000")
})