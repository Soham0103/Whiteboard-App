const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required :true,
        unique : true
    },
    password :{
        type :String,
        required : true
    }
});

//Hash the password before saving
userSchema.pre('save',async function (next){
    if(!this.isModified('password')) next();
     
    try{
        this.password = await bcrypt.hash(this.password,10);
        next();
    }catch(error){
        next(error);
    }
});

//Compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model('User',userSchema);
module.exports = User;