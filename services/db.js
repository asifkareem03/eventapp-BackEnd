//import mongoose
const mongoose=require('mongoose')

//connect db with server
mongoose.connect('mongodb://localhost:27017/reminder',{useNewUrlParser:true})

//Model Creation
const User=mongoose.model('User',{
    name:String,
    uname:String,
    password:String,
    reminders:[]
})

module.exports={
    User
}