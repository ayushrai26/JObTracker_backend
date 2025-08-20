const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    MobileNumber:{
     type:Number,
     required:false
    },
    Gender:{
      type:String,
      required:false,
    },
    JobTitle:{
        type:String,
        required:false,
    },
    userProfilePicUrl:{
        type:String,
        required:false,
    }

})

const User = mongoose.model('User',userSchema)
module.exports = User;