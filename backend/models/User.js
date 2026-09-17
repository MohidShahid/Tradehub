import mongoose from "mongoose";
const {Schema} = mongoose;


const userSchema = Schema({
    fullName : {
        type : String,
        default : null,
    },
    email : {
        type : String,
         default : null,
    },
    password : {
        type : String,
        default : null,
    },
    isBuyer : {
        type : Boolean,
        default : false,
    },
    isSeller : {
        type : Boolean,
        default : false
    }
})


const User = mongoose.model("User" , userSchema);
module.exports = User;