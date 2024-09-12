const jwt=require("jsonwebtoken")
const User=require("../Models/userModel")
const asyncHandler=require("express-async-handler")

const protect=asyncHandler(async(req,res,next)=>{
    // let token;

    // if(req.headers.authorization && 
    //     req.headers.authorization.startsWith("Bearer")
    // ){
    //     try{
    //         token= req.headers.authorization.split(" ")[1];

    //         const decode=jwt.verify(token,process.env.JWT_SECRET)
    //         req.user=await User.findById(decode.id).select("-password");
    //         next();
    //     }catch(error){
    //         res.status(401);
    //         throw new Error("Not authorized, token failed")
    //     }
    // }

    // if(!token){
    //     res.status(401);
    //         throw new Error("Not authorized, token failed")
    // }
    console.log(req.headers['chat-user'])
    if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }
})

module.exports={protect}