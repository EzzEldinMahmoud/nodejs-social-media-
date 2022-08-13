const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/users")

//create post

router.post("/post", async (req, res) => {
 
const newpost = new Post(req.body)
try{

const savedpost = await newpost.save();
res.status(200).json(savedpost)
}catch(err){
    return res.status(500).json(err)

}

})
//update post
router.put("/:id",async(req,res)=>{
   try{ const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){
await post.updateOne({$set:req.body})
res.status(200).json(post)
    }else{
        res.status(400).json({ error: "User is not logged in" })

    }}catch(err){
        res.status(500).json({ error: err })
    }
})
//delete post 
router.delete("/:id",async(req,res)=>{
    try{ const post = await Post.findById(req.params.id)
     if(post.userId === req.body.userId){
 await post.deleteOne()
 res.status(200).json("post deleted successfully ")
     }else{
         res.status(400).json({ error: "User is not logged in" })
 
     }}catch(err){
         res.status(500).json({ error: err })
     }
 })
//like or dislike post
router.put("/:id/like",async(req,res)=>{
    try{ const post = await Post.findById(req.params.id)
     if(!post.likes.includes(req.body.userId)){
 await post.updateOne({$push:{
    likes: req.body.userId
 }})
 res.status(200).json("the post has been liked")
     }else{
        await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json("the post has been disliked ")
 
     }}catch(err){
         res.status(500).json({ error: err })
     }
 })
//get a post
router.get("/:id",async(req,res)=>{
try{
    const post = await Post.findById(req.params.id)
    res.status(200).json(post)
}catch(err){
    res.status(500).json({ error: err })
}
})
//get timeline posts

router.get("/timeline/all",async(req,res)=>{
 
    try{
       const currentUser = await User.findById(req.body.userId)
       const userposts = await Post.find({
        userId: currentUser._id
       });
       const friendPosts = await Promise.all(
        
        currentUser.following.map(friendId =>{
           return  Post.find({userId:friendId})
        })
       )
       
res.json(userposts.concat(...friendPosts))
    }catch(err){
        res.status(500).json({ error: err })
    }
    })

module.exports = router;