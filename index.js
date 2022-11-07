const express=require('express');
const {connection}=require('./config/db');
require('dotenv').config();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
var cors=require('cors');
const { validUser } = require('./middleware/validUser');
const { UserModel } = require('./Model/User.model');
const todoRouter = require('./routes/todo.route');
const { TodoModel } = require('./Model/Todo.model');
const { authentication } = require('./middleware/authentication');
const port=process.env.PORT
const app=express();
app.use(express.json());
app.use(cors());
var userid

app.get('/',(req,res)=>{
    res.send("Welcome to HomePage");
})

app.post("/signup",validUser,(req,res)=>{
    const {email,password} = req.body;
    bcrypt.hash(password,+(process.env.ROUND),async(err,result)=>{
        if(err){
            res.send("signup failed");
        }else{
            const user=new UserModel({email:email,password:result});
            await user.save();
            res.send("SignUp Successfully");
        }
    })
});

app.post('/login',async(req, res)=>{
    const {email,password}=req.body;
    const user = await UserModel.findOne({email: email})
    const fpassword = user.password;
    const user_id=user._id;
    bcrypt.compare(password,fpassword,(err,result)=>{
        if(err){
            res.send("Login failed...Please try again")
        }else{
            const token=jwt.sign({userID:user_id},process.env.KEY)
            userid=user.id
            console.log(user_id)
            res.send({msg:"Login Successfully",token})
        }
})
});

// todo: implement

const validTodo=async(req,res,next)=>{
    const taskname=req.body.taskname;
    const status=req.body.status;
    const tag=req.body.tag;
    if(taskname&&tag&&status){
        await next()
    }else{
        res.send("please Fill all details")
    }
}

app.get("/todos",authentication,async(req,res)=>{
    console.log(userid)
    const todo=await TodoModel.find({userId:userid});
    res.send(todo); 
})
app.post("/todos/create",authentication,validTodo,async(req,res)=>{
    let newTodo=req.body;
    newTodo.userId =userid;
    const todo= new TodoModel(newTodo);
    await todo.save();
    res.send({msg:"Todo added successfully"})
})

app.put("/todos/:id",authentication,async(req,res)=>{
    const id =req.params.id;
    const updateTodo =req.body;
    await TodoModel.updateOne({id:id},updateTodo)
    res.send("Todo updated successfully")
})
app.delete("/todos/:id",authentication, async(req,res)=>{
    const id = req.params.id
    await TodoModel.deleteOne({id:id})
    res.send("Todo deleted")
})



















app.listen(port,async()=>{
try{
    await connection
    console.log("Connected to DB Successfully")
}catch(err){
    console.log("error to connect with DB")
}
console.log("server Connected to " + port)
})