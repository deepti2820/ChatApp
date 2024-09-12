const mongoose=require("mongoose");


const connectDB=async ()=>{
    // console.log(process.env.PORT)
    try{
        // const conn=await mongoose.connect(process.env.MONGO_URL ||"mongodb+srv://deeptisinghal2003:hJmr8Jpr6oogIMAR@cluster0.knsxz4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" )
        const conn=await mongoose.connect("mongodb://localhost:27017/chatapp");
        console.log("Connect")
    }catch(error){
        console.log(error)
    }
}

module.exports=connectDB