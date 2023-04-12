const mongoose = require('mongoose')



const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    desc:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:false
    },
    category:{
        type:String,
        required:true
    }
},{timestamps:true})



module.exports = mongoose.model('blog',BlogSchema)