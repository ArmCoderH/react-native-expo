const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add name'],
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'please add email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'please add password'],
        minlength: 8
    },
    role : {
        type : String,
        default : "user"
    }
},{timestamp: true})

module.exports = mongoose.model("User", userSchema);