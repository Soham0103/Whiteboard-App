const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema({
    owner :{type:mongoose.Schema.Types.ObjectId, ref :"User", required:true},
    shared :[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    elements :[{type:mongoose.Schema.Types.Mixed}],
    createdAt : {type:Date, default:Date.now()}
});

const Canvas = mongoose.model('Canvas',canvasSchema);
module.exports = Canvas;