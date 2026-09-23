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
    profilePic : {
        type : String,
        default : null,
    },
    isEmailVerified : {
        type : String,
        default : false,
    },
    token : {
      type : "String",
      default : null
    },
})


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password , this.password);
}


const User = mongoose.model("User" , userSchema);
module.exports = User;