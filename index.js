const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts")
dotenv.config();

//db connection
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("Connected to MongoDB");
});//set mongo url from env

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
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