const mongoose = require('mongoose')

const bookmarkedJobSchema = new mongoose.Schema({
    userId:{
    type:String,
    required:true
    },
    jobDetails:{
        jobId:{
             type : mongoose.Schema.Types.ObjectId,
             required:true
        },
        companyName : {
            type: String,
            required:true,
        },
        jobTitle:{
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
},{timestamps:true}
)

const bookmarkedJobModel = mongoose.model('bookmarkedJobs',bookmarkedJobSchema)
module.exports = bookmarkedJobModel