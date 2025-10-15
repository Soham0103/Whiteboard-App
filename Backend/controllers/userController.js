const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Secret_Key = process.env.JWT_SECRET_KEY;

//Register user
const registerUser = async (req,res,next)=>{
    try{
        console.log("got req");
        const {email,password} = req.body;

        if(!email || !password){
           return res.status(400).json({error:"All fields are required"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }

        const newUser = new User({email,password});
        await newUser.save();

        res.status(201).json({message :"User registered successfully!"});

    }catch(error){
        res.status(500).json({error:"Registration failed", details : error.message});
    }
};

//Login User
const loginUser = async (req,res)=>{
    try{
      const {email,password} = req.body;

      if(!email || !password){
           return res.status(400).json({error:"Email and password are required"});
        }
      
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Invalid credentials"});
      }

      const isMatch =await user.comparePassword(password);
      if(!isMatch){
        return res.status(400).json({error:"Invalid credentials"});
      }

      //payload is userId
      const token = jwt.sign({userId:user._id},Secret_Key,{expiresIn :"7d"});
      
      
      res.status(200).json({message:"Login successful",token :token});
    }catch(error){
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

//Get User Details
const getUser = async (req,res,next)=>{
  try{
    const user = await User.findById(req.userId,"-password");
    if(!user) res.status(404).json({error : "User not found"});
    res.json(user);
  }catch(error){
    res.status(500).json({ error: "Failed to get user", details: error.message });
  }
};

module.exports = {registerUser,loginUser,getUser};