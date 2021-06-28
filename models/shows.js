const mongoose = require('mongoose')

const showSchema = mongoose.Schema({
    name:{type:String,require:true},
    showTime:{type:Date,require:true},
    venue:{type:String,require:true},
    price:{type:Number,require:true},
    seats:{type:Number,require:true},
    bookedSeats:[]
})

module.exports = mongoose.model('shows',showSchema)