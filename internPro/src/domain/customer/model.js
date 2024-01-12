const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const CustomerSchema=new Schema({
    name:String,
    address:String,
    phoneNo:String,
    email:{type:String,unique:true,required:true},
    password:String,
    token:String,
    verified:{type:Boolean,default:false}
});

const Customer=mongoose.model("Customer",CustomerSchema);
module.exports=Customer;
