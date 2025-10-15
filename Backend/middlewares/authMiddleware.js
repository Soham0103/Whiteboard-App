const jwt = require('jsonwebtoken');
require('dotenv').config();

const Secret_Key = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req,res,next)=>{
    const token = req.header("Authorization");  //Case insensitive
    
    if (!token) return res.status(401).json({ error: "Access Denied: No Token" });

    try{
        const decoded = jwt.verify(token.replace("Bearer ",""),Secret_Key); //Contains payload
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({error : "Invalid token"});
    }

}

module.exports = authMiddleware;