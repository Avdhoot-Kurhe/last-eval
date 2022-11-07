const validUser=async (req,res,next) => {
const email=req.body.email;
const password=req.body.password;
if(email &&password){
    await next();
}else{
    res.send("Please fill all fields");
}
}

module.exports={validUser}