const booking = require('../models/booking.js')
const shows = require('../models/shows.js')
const {successMail,cancelMail} = require('./mail.js')

const newBooking = async (req,res) =>{
    const {userName,userEmail,showID,bookedSeats,bookingAmount} = req.body
    bookedSeats.flat().map((i) => parseInt(i))
    const show = await shows.findById(showID)

    for(let i=0; i<bookedSeats.length; i++){
        let flag = show.bookedSeats.indexOf(bookedSeats[i])
        if(flag !== -1){
            res.status(400).json({error:"Sheet is already Booked"})
            return
        }
    }
    try {
        const result = await booking.create({
            userName,
            userEmail,
            showID,
            bookedSeats,
            bookingAmount,
            bookingStatus:'booked',
            bookingTime: new Date().toISOString()
        })

        if(show){
            show.bookedSeats.push(bookedSeats)
            show.bookedSeats = show.bookedSeats.flat().map((i) => parseInt(i))
            const updated = await shows.findByIdAndUpdate(showID, show, {new : true})
        }
        res.status(200).json({result})
        successMail({result,show})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
}

const searchBooking = async (req,res) =>{
    const { id } = req.params;
    try {
        const bookings = await booking.aggregate([
            {

                $match : {
                    userEmail : id 

                }
            },

            { 
                "$set" : { 
                    "showID" : { 
                        "$toObjectId" : "$showID"
                    }
                }
            }, 
            { 
                "$lookup" : { 
                    "from" : "shows", 
                    "localField" : "showID", 
                    "foreignField" : "_id", 
                    "as" : "shows"
                }
            }, 
            { 
                "$unwind" : { 
                    "path" : "$shows"
                }
            }
        ]);
        // const data = []
        // for(let booking of bookings){

        //     const shows = await shows.aggregate(booking.showID)
        //     console.log(shows)

        // }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const updateBooking = async (req,res) =>{
    const data = req.body;
    try {
        const updatedPost = await booking.findByIdAndUpdate(data._id, data, { new:true })
        const show = await shows.findById(data.showID)
        const sheets = updatedPost.bookedSeats.flat().map((i) => parseInt(i))
        if(sheets.length > 0){
            for(let i=0;i< sheets.length; i++){
                show.bookedSeats = show.bookedSeats.filter((id) => id !== sheets[i])
            }
            await shows.findByIdAndUpdate(data.showID, show, {new : true})
        }
        cancelMail({show,updatedPost})
        res.status(200).json(updatedPost);        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

module.exports = {newBooking,searchBooking,updateBooking}