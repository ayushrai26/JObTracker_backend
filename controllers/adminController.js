const User  = require('../models/createNewUserModel');
const bcrypt = require('bcrypt');
const ApplicationStatus = require('../models/saveApplicationStatus')
const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminExist = await User.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin created');
    res.status(201).json({ message: 'Admin created', admin });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const saveApplicationStatus = async(req,res)=>{
  try {
    console.log('Appliation Status backend Starts')
    const {  status,userId } = req.body;
    const jobId = req.params.jobId

    if (!jobId || !status) {
      return res.status(400).json({ error: "userId and status are required" });
    }

    
    const updatedApplication = await ApplicationStatus.findOneAndUpdate(
      { jobId,userId },
      { status,
        userId,
         updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ message: "Application status saved", data: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const fetchApplicationStatus = async(req,res)=>{
  try{
    const statuses =  await ApplicationStatus.find({})
    console.log('statsues',statuses)
    res.json(statuses)


  }catch(err){
    return res.status(500).json({message:'Internal Server Error',err})
  }
}

const fetchShortlistedCandidate = async(req,res)=>{
  const shortlistedCandidate = await ApplicationStatus.aggregate([
  {
    $match: { status: "shortlisted" }
  },
  {
    $lookup: {
      from: "appliedapplications",
      let: { jobIdStr: "$jobId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", { $toObjectId: "$$jobIdStr" }]   // convert string to ObjectId
            }
          }
        }
      ],
      as: "shortlistedCandidate"
    }
  }
]);

res.status(200).json({
  message: "shortlisted candidate",
  shortlistedCandidate
});

     
}

const fetchInterviewScheduledCandidates = async(req,res)=>{
  try{
    const InterviewScheduledCandidates = await ApplicationStatus.aggregate([
{
  $match:{status:'Interview scheduled'}
},
{
  $lookup:{
    from:"appliedapplications",
    let:{jobIdObj:{$toObjectId:"$jobId"}},
    pipeline:[
      {$match:{$expr:{$eq:["$_id","$$jobIdObj"]}}}
    ],
    as:"InterviewScheduledCandidates"

  }
}
      ]) 
      res.status(200).json({message:'InterviewScheduled candidates',InterviewScheduledCandidates}) 

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const fetchInterviewedCandidates = async(req,res)=>{
   try{
  const InterviewedCandidates = await ApplicationStatus.aggregate([
    {
      $match:{status:'interviewed'}
    },
    {
      $lookup:{
        from:"appliedapplications",
        let:{jobIdObj:{$toObjectId:"$jobId"}},
        pipeline:[
          {$match:{$expr:{$eq:["$_id","$$jobIdObj"]}}}
        ],
        as:"InterviewedCandidates"
      }
    }
  ])
  return res.status(200).json({message:'Interviewed Candidates',InterviewedCandidates})

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
  
}

const fetchSelectedCandidates = async(req,res)=>{
 try{
  const SelectedCandidates = await ApplicationStatus.aggregate([
    {
      $match:{status:'selected'}
    },
    {
      $lookup:{
        from:"appliedapplications",
        let:{jobIdObj:{$toObjectId:"$jobId"}},
        pipeline:[
          {$match:{$expr:{$eq:["$_id","$$jobIdObj"]}}}
        ],
        as:"SelectedCandidates"
      }
    }
  ])
  
  return res.status(200).json({message:'Selected Candidates',SelectedCandidates})

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const fetchRejectedCandidates = async(req,res)=>{
 try{
  const RejectedCandidates = await ApplicationStatus.aggregate([
    {
      $match:{status:'reject'}
    },
    {
      $lookup:{
        from:"appliedapplications",
        let:{jobIdObj:{$toObjectId:"$jobId"}},
        pipeline:[
          {$match:{$expr:{$eq:["$_id","$$jobIdObj"]}}}
        ],
        as:"RejectedCandidates"
      }
    }
  ])
  return res.status(200).json({message:'Rejected Candidates',RejectedCandidates})

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const fetchUnderReviewCandidates = async(req,res)=>{
 try{
  const UnderReviewCandidates = await ApplicationStatus.aggregate([
    {
      $match:{status:'under review'}
    },
    {
      $lookup:{
        from:"appliedapplications",
        let:{jobIdObj:{$toObjectId:"$jobId"}},
        pipeline:[
          {$match:{$expr:{$eq:["$_id","$$jobIdObj"]}}}
        ],
        as:"UnderReviewCandidates"
      }
    }
  ])
  return res.status(200).json({message:'UnderReview Candidates',UnderReviewCandidates})

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

module.exports = { createAdmin,
  saveApplicationStatus,
  fetchApplicationStatus,
  fetchShortlistedCandidate,
  fetchInterviewScheduledCandidates,
 fetchInterviewedCandidates,
fetchSelectedCandidates,
fetchRejectedCandidates,
fetchUnderReviewCandidates };
