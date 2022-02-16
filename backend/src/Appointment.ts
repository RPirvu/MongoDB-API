import mongoose, { Schema } from 'mongoose';

const appointment = new mongoose.Schema({
    aId:{
        type: String,
        unique: true
    },
    userId: {
        type: String,
        required: "User Id Is Required!"
    },
    patientName:{
        type: String,
        required: "Patient Name Is Required!"
    },
    doctorId:{
        type: String,
        default: 'undefined'
    },
    doctorName:{
        type: String,
        default: 'undefined'
    },
    appointmentType:{
        type:String,
        required: "Appointment Type Is Required!"
    },
    date:{
        type: String,
        default: 'undefined'
    },
    priceIntervention:{
        type: Number,
        default: 0
    },
    priceConsult:{
        type: Number,
        default: 0
    },
    ustensils:{
        type: String,
        default: ''
    },
    status:{
        type: String,
        enum: ['Pending','Accepted','Declined','Complete'],
        default: 'Pending'
    }
});


export default mongoose.model("Appointment", appointment);