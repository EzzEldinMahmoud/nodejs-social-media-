const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv =require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const posts = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
    console.log("Connected to MongoDB");
});


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute)
app.use("/api/auth",userAuth)
app.use("/api/posts",posts)
app.listen(8800,()=>{
    console.log("Server running at http://127.0.0.1:8800");
})
