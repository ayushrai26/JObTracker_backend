const mongoose  = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    company:{
        type:String,
        required:true
    },
    skill:{
        type:String,
        required:true
    },
    userId: { type:String, required: true },
  createdAt: { type: Date, default: Date.now }
})
const NotificationModel = mongoose.model('notification',NotificationSchema)
module.exports = NotificationModel