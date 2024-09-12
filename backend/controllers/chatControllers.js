const asyncHandler=require("express-async-handler")
const Chat=require("../Models/chatModel")
const User=require("../Models/userModel")

const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
        console.log("UserId params not send with request");
        return res.sendStatus(400);
    }
    if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }
    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.chatUser._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")


    isChat=await User.populate(isChat,{
        path:'latestMessage.sender',
        select:"name pic email"
    })
    if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }
    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.chatUser._id,userId],
        };

        try{
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id:createdChat.id})
            .populate("users","-password")

            res.status(200).send(FullChat)
        }catch(error){
            res.status(400);
            throw new Error(error.message)
        }
    }
})


const fetchChat=asyncHandler(async(req,res)=>{
    if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }
    try{
        Chat.find({users:{
            $elemMatch:{$eq:req.chatUser._id}
        }})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })

            res.status(200).send(results)
        })
    }catch(error){
        res.status(400);
        console.log(error)
        throw new Error(error.message)
    }
})


const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.users ){
        return res.status(400).send({message:"Please fill all the fields "})
    }

    if(!req.body.name){
        return res.status(400).send({message:"Please fill all the name "})

    }

    var users=JSON.parse(req.body.users);

    if(users.length<2){
        return res.status(400).send("More than 2 users are required to form a chat")
    }

    if (req.headers['chat-user']) {
        try {
          req.chatUser = JSON.parse(req.headers['chat-user']);
        } catch (error) {
          console.error('Error parsing chatUser header:', error);
          return res.status(400).json({ message: 'Invalid chatUser data' });
        }
      }

    users.push(req.chatUser);

    try{
        const groupChat =await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.chatUser
        })

        const FullChat=await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            res.status(200).json(FullChat)
        
    }catch(error){
        res.status(400);
        throw new Error(error.message)
    }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName,
        },{
            new:true,
        }
    )  .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat not found");
    }else{
        res.json(updatedChat)
    }
})

const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;

    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}   ,    
        },{new :true}
    ).populate("users","-password")
    .populate("groupAdmin","-password")


    if(!added){
        res.status(404);
        throw new Error("Chat not found");
    }else{
        res.json(added)
    }
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;

    const remove=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}   ,    
        },{new :true}
    ).populate("users","-password")
    .populate("groupAdmin","-password")


    if(!remove){
        res.status(404);
        throw new Error("Chat not found");
    }else{
        res.json(remove)
    }
})

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}