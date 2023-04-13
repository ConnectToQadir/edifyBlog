const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')



// middlewares
app.use(express.json())
app.use('/api/blogs',blogRoutes)
app.use('/api/auth',authRoutes)



app.get("/",(req,res)=>{
    res.send("Server is Running")
})




async function connectDb(){
    try {
        await mongoose.connect('mongodb+srv://qadir:123@edify.0i5koc5.mongodb.net/blog?retryWrites=true&w=majority')
        console.log("Connected!")
    } catch (error) {
        console.log("Not Connected")
    }
}
connectDb()


app.listen(4600,()=>{
    console.log("Server is Running on Port 4600")
})