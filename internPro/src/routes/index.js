const express=require("express");
const router=express.Router();
const customerRoutes=require("./../domain/customer")
const EmailVerificationRoutes = require("./../domain/email_verification");

router.use("/customer",customerRoutes);
router.use("/email_verification",EmailVerificationRoutes)

module.exports=router;