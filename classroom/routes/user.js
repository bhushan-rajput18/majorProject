import express from 'express';
const router = express.Router();

//index - users
router.get("/", (req,res) => {
    res.send("Get for users ")
})

// show - users
router.get("/:id", (req,res) => {
    res.send("Get for users id ")
})

//post - users
router.post("/", (req,res) => {
    res.send("post for user ")
})

//delete - users
router.delete("/:id", (req,res) => {
    res.send("delete for user id ")
})

export default router;