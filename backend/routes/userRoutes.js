const express=require('express');
const {registerUser,authUser, allUsers}=require("../controllers/userControllers");
const { protect } = require('../middlerware/authMiddleware');

const router=express.Router()

router.route("/").get( allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);


module.exports=router