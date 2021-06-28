const shows = require('../models/shows.js')

const newShow = async (req,res) => {
    const data = req.body 
    try {
        const result = await shows.create(data)
        res.status(200).json({result})
    } catch (error) {   
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
}
const showData = async (req,res) => {
    try {
        const data = await shows.find({showTime : {$gt : new Date()}})
        res.status(200).json({data})
    } catch (error) {   
        res.status(500).json({message:"Something Went Wrong"})
    }
}

module.exports = {newShow,showData}