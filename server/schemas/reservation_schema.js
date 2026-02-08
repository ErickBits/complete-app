import mongoose from "mongoose";

const reservation_schema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    customerName: {
        required: true,
        type: String,
        trim: true
    },

    customerEmail: {
        required: true,
        type: String,
        trim: true
    },

    customerPhone: {
        type: String,
        trim: true
    },

    tableNumber: {
        required: true,
        type: Number,
        min: 1
    },

    numberOfGuests: {
        required: true,
        type: Number,
        min: 1
    },

    date: {
        required: true,
        type: Date
    },

    time: {
        required: true,
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },

    specialRequests: {     
        type: String,  
        trim: true
    }

}, { timestamps: true });

export default mongoose.model('reservations', reservation_schema);