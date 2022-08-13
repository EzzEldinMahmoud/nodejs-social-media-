const router = require("express").Router();
const User = require("../models/users")
const bcrypt = require("bcrypt");
const { response } = require("express");
//REGISTER
router.post("/register", async(req,res)=>{
    
    try{
        //generate hash password
const salt = await bcrypt.genSalt(10);
const hashedpassword = await bcrypt.hash(req.body.password,salt)
//create new user
const NewUser = await new User({
    username:req.body.username,
    password:hashedpassword,
    email:req.body.email,
    
        })

        //save user and send response staus and message 
        const user =  await  NewUser.save();
        res.status(200).json(user);
        res.send("user registerd")
    }catch(error){

        res.status(500).json(err)
    }
 
 
}) 
//Login
router.post("/login",async(req,res)=>{
  try{  
    const user = await User.findOne({
    email:req.body.email
    
})     
 !user && res.status(404).json("user not found")
 const validPassword = await bcrypt.compare(req.body.password,user.password)
 !validPassword && res.status(400).json("password is not correct")

 res.status(200).json(user)
}catch(err){  
    res.status(500).json(err)
}
})
//update
//delete

module.exports = router;