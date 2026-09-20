const  mongoose = require("mongoose");
const bcrypt = require("bcrypt")
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

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password , this.password);
}


const User = mongoose.model("User" , userSchema);
module.exports = User;