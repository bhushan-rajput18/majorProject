import express from 'express';
const router = express.Router();

//posts 
//index
router.get("/", (req,res) => {
    res.send("get for posts ")
})

// show 
router.get("/:id", (req,res) => {
    res.send("Get for post id ")
})

//post
router.post("/", (req,res) => {
    res.send("post for posts ")
})

//delete 
router.delete("/:id", (req,res) => {
    res.send("delete for posts id")
})

export default router;