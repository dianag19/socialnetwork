const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER USER
router.post("/register", async (req, res) => {


    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password");

        const token = jwt.sign({ _id: user._id }, "secret")
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).send({
            message: 'success'
        })
    } catch (err) {
        res.status(500).json(err)
    }

})
//GET USER AUTHENTICATED
router.get("/user", async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie,'secret')
        if(!claims){
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }
        const user = await User.findOne({_id: claims._id})
        const {password,...data} = await user.toJSON();
        res.send(data);
    } catch (err) {
        res.status(401).send({
            message: 'uanuthenticated'
        })
    }

})
//LOGOUT
router.post("/logout", (req,res)=>{
    res.cookie('jwt','',{ maxAge:0});
    res.send({
        message: 'success'
    })
})
module.exports = router;