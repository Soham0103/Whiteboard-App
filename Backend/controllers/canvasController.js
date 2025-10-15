const Canvas = require('../models/canvasModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');


//Create new canvas 
const createCanvas = async (req,res)=>{
    try{
        const userId = req.userId;

        const newCanvas = new Canvas({
            owner: userId,
            shared: [],
            elements: []
        });
        await newCanvas.save();
        res.status(201).json({message : "Canvas created successfully", canvasId : newCanvas._id});
    }catch(error){
        res.status(500).json({error:"Failed to create canvas", details: error.message});
    }
};

//Load canvas
const loadCanvas = async (req,res) =>{
    try{
    const userId = req.userId;
    const canvasId = req.params.id;

    const canvas = await Canvas.findById(canvasId);
    if(!canvas){
        return res.status(404).json({error : "Canvas not found"});
    }
    //Ensure only owner or the shared ones have the access
    if(canvas.owner.toString()!== userId && !canvas.shared.includes(userId)){
       return res.status(403).json({error:"Unauthorized to access this canvas"});
    }

    res.json(canvas);
}catch(error){
    res.status(500).json({error:"Failed to load canvas", details: error.message});
}
};

//Get list of canvases
const getUserCanvases = async (req,res)=>{
    try{
        const userId = req.userId;
        const canvases = await Canvas.find({$or :[{owner : userId},{shared:userId}]}).sort({createdAt :-1});
        res.json(canvases);
    }catch(error){
        res.status(500).json({error:"Failed to fetch canvases", details: error.message});
    }
};

//Share canvas
const shareCanvas = async(req,res)=>{
 try{
    const canvasId = req.params.id;
    const {email} = req.body;
    const userId = req.userId;

    if (!email) {
        return res.status(400).json({ error: "Email is required in the request body" });
    }


    //Find user by email
    const userToShare = await User.findOne({email});
    if(!userToShare){
        return res.status(404).json({error:"User with this email not found"})
    }

    const canvas = await Canvas.findById(canvasId);
    if(!canvas){
        return res.status(404).json({error:"Canvas not found"});
    }

    //Ensure owner can only share
    if(canvas.owner.toString()!== userId){
        return res.status(403).json({error:"Only owner can share the canvas"});
    }

    //Ensure that shared userId is of type ObjectId
    const sharedUserId = new mongoose.Types.ObjectId(userToShare._id);

    //Prevent adding owner to shared list
    if(canvas.owner.toString()===sharedUserId.toString()){
        return res.status(400).json({error :"Can't share with owner itself"});
    }
 
    //Check if user to be shared with is already in the shared list
    const alreadyShared = canvas.shared.some(id=> id.toString()===sharedUserId.toString());
    if(alreadyShared){
        return res.status(400).json({error :"Already shared with user"});
    }

    //Add user to shared list
    canvas.shared.push(sharedUserId);
    await canvas.save();
    res.json({message:"Canvas shared successfully"});
 }catch(error){
    res.status(500).json({error:"Failed to share canvs", details :error.message});
 }
}

//Unshare the canvas
const unshareCanvas = async (req,res)=>{
    try{
        const {userIdToRemove} = req.body;
        const canvasId = req.params.id;
        const userId = req.userId;
        
        if (!userIdToRemove) {
            return res.status(400).json({ error: "userIdToRemove is required in the request body" });
        }

        const canvas = await Canvas.findById(canvasId);
        if(!canvas){
            return res.status(404).json({error:"Canvas not found"});
        }

        //Ensure only owner has rights to unshare a canvas
        if(canvas.owner.toString()!==userId){
            return res.status(403).json({error:"Only the owner can unshare the canvas"});
        }

        // Prevent the owner from being removing itself
        if (userIdToRemove === canvas.owner.toString()) {
            return res.status(400).json({ error: "The owner cannot be unshared from their own canvas" });
        }

        //Remove user from shared list
        canvas.shared = canvas.shared.filter(id => id.toString()!==userIdToRemove);
        await canvas.save();
        res.json({message:"Canvas unshared successfully"});

    }catch(error){
        res.status(500).json({error:"Failed to unshare canvas",details:error.message});
    }
};


//Update an existing canvas
const updateCanvas = async (req,res)=>{
    try{
      const {canvasId, elements} = req.body;
      const userId = req.userId;

      const canvas = await Canvas.findById(canvasId);
      if(!canvas){
       return res.status(400).json({error :"Error canvas not found"});
      }

      //Ensure only the owner or the shared ones have the access
      if(canvas.owner.toString()!== userId && !canvas.shared.includes(userId)){
       return res.status(403).json({error : "Unauthorized to update this canvas"});
      }
    
      canvas.elements = elements;
      await canvas.save();

      res.json({message : "Canvas updated successfully"});
    }catch(error){
        res.status(500).json({ error: "Failed to update canvas", details: error.message });
    }
};

//Delete canvas
const deleteCanvas = async (req,res)=>{
    try{
        const canvasId = req.params.id;
        const userId = req.userId;

        const canvas = await Canvas.findById(canvasId);
        if(!canvas){
            return res.status(404).json({error :"Canvas not found"});
        }

        //Ensure only owner deletes the canvas
        if(canvas.owner.toString()!== userId){
            return res.status(403).json({error :"Only owner can delete this canvas"});
        }
        await Canvas.findByIdAndDelete(canvasId);
        res.json({message:"Canvas deleted successfully"});
    }catch(error){
        res.status(500).json({error :"Failed to delete canvs", details : error.message});
    }
};

module.exports = {createCanvas,loadCanvas,getUserCanvases,updateCanvas,deleteCanvas,shareCanvas, unshareCanvas};