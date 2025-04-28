const mongoose = require('mongoose');
const connectdb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected to MONGODB");
    } catch (error) {
        console.log(error);
    }
}

module.exports=connectdb


