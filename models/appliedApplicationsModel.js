const mongoose = require('mongoose')

const appliedApplicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    skill:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    coverLetter:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    jobId:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    }
    
})

const appliedApplicationModel = mongoose.model('appliedApplications',appliedApplicationSchema)
module.exports = appliedApplicationModel