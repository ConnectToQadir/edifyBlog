const router = require('express').Router()
const userModal = require('../modal/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        var hashedPassword = await bcrypt.hash(password, 10)
        const response = await userModal.create({ username, email, password: hashedPassword })
        res.status(201).json({
            success: true,
            message: response
        })
    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        // find user
        const foundUser = await userModal.findOne({ username })

        if (!foundUser) {
            return (res.status(404).json({
                success: false,
                message: "Invalid Usernam or Password"
            }))
        }

        // Match Password
        const isMatched = await bcrypt.compare(password,foundUser.password)

        if(!isMatched){
            return (res.status(404).json({
                success: false,
                message: "Invalid Usernam or Password"
            }))
        }


        // generate jwt
        const token = await jwt.sign({username:foundUser.username,email:foundUser.email},"abc",{'expiresIn':"1d"})


        res.status(201).json({
            success: true,
            message: token
        })


    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})


router.delete('/delUser/:id',async(req,res)=>{
    var token = req.headers.token
    

    // checkToken
    var isTokenOk = await jwt.verify(token,"abc")

    if(!isTokenOk){
        return (res.status(403).json({
            success: false,
            message: "Invalid Token Passed"
        }))
    }

    // if admin
    try {
        const decodedToken = await jwt.decode(token)
        console.log(decodedToken)
    } catch (error) {
        console.log(error)
    }


})


module.exports = router