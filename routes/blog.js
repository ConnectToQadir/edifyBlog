const router = require('express').Router()
const blogModal = require('../modal/blog')





router.post('/addBlog', async (req, res) => {
    try {
        const response = await blogModal.create(req.body)
        res.status(201).json({
            success: true,
            message: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.get('/', async (req, res) => {
    try {

        var match = {}
        var page = req.query.page || 1
        var limit = req.query.limit || 2
        var skip = (page - 1) * limit


        if(req.query.keyword){
            match.title = new RegExp(req.query.keyword,"i")
        }

        if (req.query.category) {
            match.category = req.query.category
        }

        if (req.query.author) {
            match.author = req.query.author
        }

        var response = {}
        response.blogs = await blogModal.find(match, { desc: 0 }).limit(limit).skip(skip)
        response.count = await blogModal.find(match).count()

        res.status(201).json({
            success: true,
            message: response
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const response = await blogModal.findByIdAndDelete(req.params.id)
        res.status(201).json({
            success: true,
            message: "Blog Deleted!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const response = await blogModal.findByIdAndUpdate(req.params.id, { $set: req.body, new: true })
        res.status(201).json({
            success: true,
            message: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const response = await blogModal.findById(req.params.id)
        res.status(201).json({
            success: true,
            message: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
})



module.exports = router