const asyncHandler=require("express-async-handler")
const User=require("../Models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt=require("bcryptjs")


const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password,pic}=req.body

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExists=await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

     const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt)
    const user=await User.create({
        name,email,password:hashPassword,pic
    });
    if(user ){
        console.log(user)
        return res.status(201).send({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            // token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failder to create user");
    }
})


const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    const compare=await bcrypt.compare(password,user.password)
    console.log(password);
    console.log(user)
    if(user&& compare){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            // token:generateToken(user._id)
        })

    }else{
        res.status(401);
        throw new Error("Invalid email or password")
    }
})


// const allUsers=asyncHandler(async(req,res)=>{
//     console.log(req.query.search)
//     const keyword=req.query.search?{
//         $or:[
//             {name:{$regex:req.query.search,$options:"i"}},
//             {email:{$regex:req.query.search,$options:"i"}},
//         ]
//     }:{}

//     const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
//     res.send(users)
// })

const allUsers = asyncHandler(async (req, res) => {
    console.log(req.query.search)
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

      if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }
  
    const users = await User.find(keyword).find({ _id: { $ne: req.chatUser._id } });
    res.send(users);
  });

module.exports={registerUser,authUser,allUsers}