const jwt=require("jsonwebtoken")

const generateToken=(id)=>{
    return jwt.sign({id},"deepti",{
        expires:"2d",
    })
}

module.exports=generateToken