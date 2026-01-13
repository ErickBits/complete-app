import mongoose from "mongoose";

const user_schema = new mongoose.Schema({

    email:{
        unique: true,
        required: true,
        type: String,
        trim: true
    },

    name:{
        required: true,
        type: String
    },

    lastname:{
        required: true,
        type: String
    },

    password: {
        required: true,
        type: String,
        trim: true
    },

    // Adding role field to the user schema
    // This field will determine if the user is a regular user or an admin

    role: {
        type: String,
        enum: ['user', 'admin'],  // Only allow 'user' or 'admin'
        default: 'user'           // Most users will be regular users
    }
    
    },{timestamps: true}
);

export default mongoose.model('users', user_schema);