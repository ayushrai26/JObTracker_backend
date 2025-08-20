const mongoose = require('mongoose')

const createNewJobSchema = mongoose.Schema({
    jobDetails:{
        companyName : {
            type: String,
            required:true,
        },
        jobTitle:{
            type:String,
            required:true,
        },
        roles:{
            type:String,
            required:true,
        },
        address:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        }

    },
    Compensation:{
        etype:{
            type:String,
            required:true,
        },
        shifttype:{
            type:String,
            required:true
        },
        salary:{
            type:String,
            required:true,

        },
        benefits:{
            type:[String],
            required:true
        }
    },
    jobDescription:{
        jobSummary:{
            type:String,
            required:true
        },
        responsibility:{
            type:String,
            required:true
        },
        qualification:{
            type:String,
            required:true
        }
    }
},{timestamps:true})

const createNewJobModel = mongoose.model('newJobs',createNewJobSchema)
module.exports = createNewJobModel