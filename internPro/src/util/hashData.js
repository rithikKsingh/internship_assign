const bcrypt=require("bcrypt");

const hashData=async(data,saltRounds=10)=>{
    try{
    const hashedData=await bcrypt.hash(data,saltRounds);
    return hashedData;
    }catch(err){
        throw err;
        console.log(err);
    }
}

const verifyHashedData=async(unhashed,hashed)=>{
    try {
        const match=await bcrypt.compare(unhashed,hashed);
        return match;
    } catch (error) {
        throw error;
    }
}

module.exports={hashData,verifyHashedData};