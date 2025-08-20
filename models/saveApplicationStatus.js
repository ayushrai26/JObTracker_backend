const mongoose = require('mongoose')


const applicationSchema = new mongoose.Schema({
  jobId: String,
  status: String,
  userId:String,
  updatedAt: { type: Date, default: Date.now }
});

const ApplicationStatus = mongoose.model("ApplicationStatus", applicationSchema);
module.exports = ApplicationStatus