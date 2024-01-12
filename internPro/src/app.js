require("./config/db");
const express=require("express");
const bodyParser=express.json;
const cors=require("cors");
const routes=require("./routes")

const app=express();
const PORT=3000;

app.use(cors());
app.use(bodyParser());
app.use(routes);

app.listen(PORT,()=>{
    console.log(`server started running on port : ${PORT}`)
});
module.exports=app;