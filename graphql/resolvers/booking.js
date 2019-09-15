const Event=require('../../models/event');
const Booking=require('../../models/booking');
const{transformEvent,transformBooking}=require('./merge');

module.exports={
    bookings: async ()=>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return transformBooking(booking);
            });
        } catch(err){
            throw err;
        }
    },
    bookEvent: async args=>{
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking= new Booking({
            user:'5d7bcfa757310101587e7e43',
            event: fetchedEvent 
        });
        const result= await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async args=>{
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await booking.deleteOne({_id:args.bookingId});
            //const booking = await Booking.findById(args.bookingId);
            return event; 
        }catch(err){
            throw err;
        }
    }
};