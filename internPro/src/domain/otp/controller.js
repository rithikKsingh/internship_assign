const OTP=require("./model");
const generateOTP = require("../../util/generateOTP");
const sendEmail=require('../../util/sendEmail');
const {hashData,verifyHashedData}=require("./../../util/hashData");

const {AUTH_EMAIL}=process.env;

const verifyOTP=async({email,otp})=>{
    try{
        if(!(email&&otp)){
            throw Error("Provide calues for email and otp");
        }

        const matchedOTPRecord=await OTP.findOne({
           email, 
        })
        if(!matchedOTPRecord){
            throw Error("No otp records found");
        }
        const {expiresAt}=matchedOTPRecord;

        if(expiresAt<Date.now()){
            await OTP.deleteOne({email});
            throw Error("Code has expired.Request for new one.")
        }

        const hashedOTP=matchedOTPRecord.otp;
        const validOTP=await verifyHashedData(otp,hashedOTP);
        return validOTP;
    }catch(error){
         throw error;
    }
}

const sendOTP=async({email,subject,message,duration=1})=>{
  
    try {
        if(!(email&&subject&&message)){
            throw Error("Provide values for email, subject,message");
        }

        //clear any old record
        await OTP.deleteOne({email});

        //generate pin
        const genOTP=await generateOTP();

        //send email
        const mailOptions={
            from:AUTH_EMAIL,
            to:email,
            subject,
            html:`<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;">
            <b>${genOTP}</b></p><p>This code <b>expires in ${duration} hours(s)</b>.</p>`,
        };

        await sendEmail(mailOptions);
        const hashedOTP=await hashData(genOTP);
        const newOTP=await new OTP({
            email,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiresAt:Date.now()+3600000*+duration,
        });

        const createdOTPRecord=await newOTP.save();
        return createdOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP=async(email)=>{
    try {
    await OTP.deleteOne({email});
    } catch (error) {
        throw error;
    }
}

module.exports={sendOTP,verifyOTP,deleteOTP};