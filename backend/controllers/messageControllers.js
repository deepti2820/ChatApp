const Chat = require("../Models/chatModel");
const Message=require("../Models/messageModel");
const User = require("../Models/userModel");

const sendMessage=async(req,res)=>{
    const {content,chatId}=req.body;
    if(!content || !chatId){
        console.log("Invalid data passed into request")
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
    var newMessage={
        sender:req.chatUser._id,
        content:content,
        chat:chatId
    }

    try{
        var message=await Message.create(newMessage);
        message=await message.populate("sender","name pic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.json(message)
    }catch(error){
            res.status(400);
            throw new Error(error.message)
    }
}


const allMessages=async(req,res)=>{
    try{
        const messages= await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
        res.send(messages)
    }catch(error){
        res.status(400);
        throw new Error(error.message)
    }
}

module.exports={sendMessage,allMessages}