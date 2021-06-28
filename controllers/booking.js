const booking = require('../models/booking.js')
const shows = require('../models/shows.js')

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
        res.status(404).json({ message: error.message });
    }
}

module.exports = {newBooking,searchBooking}