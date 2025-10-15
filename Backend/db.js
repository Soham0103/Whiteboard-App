const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGO_URL;
const connectionParams = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
};

const connectToDB = async ()=>{
    try{
    
        await mongoose.connect(connectionString,connectionParams);
        console.log("Connected to Database")
    }catch(err){
        console.log(`Error Connectiong to Database : ${err.message}`);
    }
};

module.exports = connectToDB;