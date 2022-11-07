const express= require('express');
const { TodoModel } = require('../Model/Todo.model');
const todoRouter=express.Router();

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

todoRouter.get("/",async(req,res)=>{
    const todo=await TodoModel.find({user_id});
    res.send(todo);
})

module.exports=todoRouter