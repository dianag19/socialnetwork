const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv/config')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//db connection
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("Connected to MongoDB");
});//set mongo url from env

//middlewares
app.use(express.json());//use response as json
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cors({
    credentials : true,
    origin:['http://localhost:8800','http://localhost:8080',"*"]
}))
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
/*app.get("/", (req,res)=>{
    res.send("Welcome to homepage");
});

app.get("/users", (req,res)=>{
    res.send("Welcome to user page");
})*/
  
app.listen(8800, ()=>{
    console.log("Backend server is runing!")
})