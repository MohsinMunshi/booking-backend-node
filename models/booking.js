const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    userName:{type:String,require:true},
    userEmail:{type:String,require:true},
    bookingTime:{type:String,require:true},
    bookingStatus:{type:String,require:true},
    showID:{type:String,require:true},
    bookedSeats:[],
    bookingAmount:{type:Number,require:true},
})

module.exports = mongoose.model('booking',bookingSchema)