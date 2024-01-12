const Customer=require("./model");
const {hashData,verifyHashedData}=require('../../util/hashData')
const createToken=require("./../../util/createToken")

const authenticateCustomer=async(data)=>{
    try{
       const {email,password}=data;
       const fetchedCustomer=await Customer.findOne({email});
       if(!fetchedCustomer){
        throw Error("Invalid credentials")
       }
       if(!fetchedCustomer.verified){
        throw Error("Email hasnt been verified yet.Check your inbox")
       }

       const hashedPassword=fetchedCustomer.password;
       const passwordMatch= await verifyHashedData(password,hashedPassword)
       if(!passwordMatch){
        throw error("Invalid password enterd")
       }  

       //create user token
      const tokenData={customerId:fetchedCustomer._id,email};
      const token=await createToken(tokenData);

      fetchedCustomer.token=token;
      return fetchedCustomer;
    }catch(err){
        throw err;
    }
}

const createNewCustomer=async(data)=>{
try{
    const {name,email,password}=data;
    const existingCustomer=await Customer.findOne({email});
    if(existingCustomer){
        throw Error("User already exist")
    }
    const hashedPassword=await hashData(password);
    const newCustomer=new Customer({
        name,
        email,
        password:hashedPassword
    });

    const createdCustomer=await newCustomer.save();
    return createdCustomer;
}catch(err){
    throw err;
    console.log(err.message);
}
};

module.exports={createNewCustomer,authenticateCustomer}