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
        const isMatched = await bcrypt.compare(password, foundUser.password)

        if (!isMatched) {
            return (res.status(404).json({
                success: false,
                message: "Invalid Usernam or Password"
            }))
        }


        // generate jwt
        const token = await jwt.sign({ username: foundUser.username, email: foundUser.email }, "abc", { 'expiresIn': "20s" })


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


var checkAdmin = async (req, res, next) => {
    try {
        var token = req.headers.token
        var decodedUser = await jwt.verify(token, "abc")
        if (decodedUser.username === "admin") {
            next()
        } else {
            return (res.status(403).json({
                success: false,
                message: "You are not Authorized"
            }))
        }
    } catch (error) {
        return (res.status(403).json({
            success: false,
            message: "Invalid Token Passed"
        }))
    }

}


router.delete('/delUser/:id', checkAdmin, async (req, res) => {
    // checkToken

    try {

        const foundUser = await userModal.findById(req.params.id)

        if (!foundUser) {
            return (res.status(404).json({
                success: false,
                message: "User with this ID not Found"
            }))
        }

        await userModal.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "User Deleted Successfully!"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }

})


router.get('/getUsers',checkAdmin,async (req,res)=>{
    try {
        var users = await userModal.find()
        res.status(200).json({
            success:true,
            message:users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }
})


module.exports = router