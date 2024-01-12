const Customer=require("./../customer/model");
const {sendOTP,verifyOTP,deleteOTP}=require("./../otp/controller")

const verifyCustomerEmail = async ({ email, otp }) => {
    try {
     const validOTP = await verifyOTP({ email, otp });
     if (!validOTP) {
      throw Error("Invalid code passed. Check your inbox.") ;
     }

     await Customer.updateOne({email},{verified:true})
    await deleteOTP(email) ;
    return;
    } catch (error) {
    throw error;
    }
};

const sendVerificationOTPEmail=async(email)=>{
    try {
        const existingCustomer=await Customer.findOne({email});
        if(!existingCustomer){
            throw Error("There's no account for this email")
        }

        const otpDetails = {
            email,
            subject: "Email Verification",
            message: "Verify your email with the code below.",
            duration: 1,
           }
            const createdOTP = await sendOTP(otpDetails);
            return createdOTP;
    } catch (error) {
        throw error;
    }
}

module.exports={sendVerificationOTPEmail,verifyCustomerEmail};