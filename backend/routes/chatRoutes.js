const express=require('express');
const { protect } = require('../middlerware/authMiddleware');
const { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const router=express.Router()

// router.route("/").post(protect,accessChat);

// router.route("/").get(protect,fetchChat);


// router.route("/group").post(protect,createGroupChat);
// router.route("/rename").put(protect,renameGroup);
// router.route("/groupremove").put(protect,removeFromGroup);
// router.route("/groupadd").get(protect,addToGroup);





router.route("/").post(accessChat);

router.route("/").get(fetchChat);


router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupremove").put(removeFromGroup);
router.route("/groupadd").put(addToGroup);




module.exports=router