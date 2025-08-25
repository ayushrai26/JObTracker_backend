const User = require('../models/createNewUserModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Job = require('../models/createNewJobModel.js')
const savedBookmarkedJobs = require('../models/bookmarkedJobModel.js')
const appliedApplication = require('../models/appliedApplicationsModel.js')
const nodemailer = require('nodemailer');
const Notification = require('../models/notificationModel.js')
const applicationStatus = require('../models/saveApplicationStatus')


const createNewUser = async(req,res)=>{
      const {fullName,email,password} = req.body
      try{
        const existingUser = await User.findOne({email});
        if(existingUser)
          {
           return res.status(400).json({message:'User already exist'})
            
        }
       const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({email,password:hashedPassword,fullName})
      
        await newUser.save();
        res.status(200).json({message:'User created'})

      } 
      catch(error)
      {
        res.status(500).json({error:'Something went wrong',error: error.message})
      }
}

const loginUser = async(req,res)=>{
  const {email,password} = req.body
  try{
     const userExist = await User.findOne({email})
   if(!userExist){
    return res.status(404).json({message:'User not found'})
   }
   

   const isPasswordValid = await bcrypt.compare(password,userExist.password)
   if(!isPasswordValid){
    return res.status(400).json({message:'Wrong Password'})
   }
   
   const token = jwt.sign(
    {id:userExist._id,role:userExist.role},
    process.env.JWT_SECRET,
    {expiresIn:'4h'}
   )
   return res.status(200).json({message:'Login Successfull',token,user:{
    id:userExist._id,
    email:userExist.email,
    fullName:userExist.fullName,
    role:userExist.role
   }})
  }catch(err)
  {
      return res.status(500).json({message:'Server Error',error: err.message})
  }
  
  
}

const createNewJob =  async (req, res) => {
  try {
    const { jobData } = req.body;
    const existJob = await Job.findOne(jobData)
    if(existJob){
      return res.status(400).json({message:'Job Already exist'})
    }
    const newJob = new Job(jobData);
    const savedJob = await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: savedJob });
  } catch (error) 
  {

    res.status(500).json({ message: 'Internal Server Error' ,error: error.message});
  }
};

const fetchAllJobs = async (req, res) => {
  try {
    
    const jobs = await Job.find();
    
    

    if (!jobs || jobs.length === 0) 
    {
      return res.status(404).json({ message: 'No jobs found' });
    }

  
    res.status(200).json({message:'Jobs fetch successfully',jobs});
  } catch (error) 
  {
    
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

const createBookmarkJobs = async (req, res) => {
  try {
    const job = req.body; 
  
    if (!job || !job.jobDetails?.companyName) {
      return res.status(400).json({ message: 'Job data or company name missing' });
    }

    const existing = await savedBookmarkedJobs.findOne({ 'jobDetails.jobId':job.jobDetails.jobId , userId:job.userId});

    if (existing) {
      return res.status(200).json({ message: 'Job is Already bookmarked' });
    }

    const newBookmarkedJob = new savedBookmarkedJobs(job); 
    await newBookmarkedJob.save();

    return res.status(201).json({
      message: 'Job saved successfully',
      saved: newBookmarkedJob
    });

  } catch (err) {
    
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const fetchBookmarkJobs = async(req,res)=>{
  try{
    const userId = req.user.id;
  
    const {jobId} = req.body;
    
   const data = await savedBookmarkedJobs.findOne({userId,'jobDetails.jobId':jobId})
  
   if(!data || data.length === 0){
    return res.status(404).json({message:'No saved jobs found'})
   }else
    {
    return res.status(200).json(data)
   }
  }catch (error) 
  {
    
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
}
}

const deleteBookmarkedJobs = async (req, res) => {
  
  try {
    const userId = req.user.id
    const {jobId}  = req.body;
    

    const deletedBookmarkedJob = await savedBookmarkedJobs.findOneAndDelete({
      userId,
      'jobDetails.jobId': jobId
    });


    if (!deletedBookmarkedJob) {
      return res.status(400).json({ message: 'Saved job not found' });
    }

    return res.status(200).json({ message: 'Deleted successfully', deletedBookmarkedJob });
  } catch (err) {
    
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const UserforgetPassword = async(req,res)=>{
  const {email} = req.body;
  try{
     const user = await User.findOne({email})
     if(!user){
      return res.status(404).json({message:'User not found'})
     }
     return res.status(200).json({message:'User found'})
  }catch(err){
       return res.status(500).json({message:'Internal Server Error',error:err.message})
  }
}

const changeUserPassword = async(req,res)=>{

  const {email,password} = req.body;
  try{
    const user = await User.findOne({email})
  

    const hashedPassword = await bcrypt.hash(password,10)
              user.password= hashedPassword;
              await user.save();
              res.status(200).json({message:'Password succefully updated'})
  }catch(err)
  {
    return res.status(500).json({message:'Server error',error:err.message})
  }
  
}

const fetchIndividualJobWithId = async(req,res)=>{
   const {jobId} = req.body;
   try{

   const job = await Job.findById(jobId)
  
   if(!job){
    return res.status(401).json({message:'Job not found'})
   }
   return res.status(200).json({ message: 'Fetch successful', job });


   }catch(err){
    
    return res.status(500).json({ message: 'Server error', error: err.message });

   }
}

const saveUserAppliedApplications = async(req,res)=>{
     const {name,email,skill,company,coverLetter,userId,jobId,resume} = req.body ;
      
     try{
     const existing = await appliedApplication.findOne({userId,email,company,skill})
     
     if(existing){
      return res.status(400).json({message:'Already applied'})
     }else{
      const newApplication = new appliedApplication({name,email,skill,company,coverLetter,userId,jobId,resume})
     
     await newApplication.save()
     
     return res.status(200).json({message:'Application Submitted'})
     }
     
     }catch(err){
          return res.status(500).json({message:'Server Error',error:err.message})
     }
 
}

const fetchUserAppliedApplications = async (req, res) => {
  try {
  
  
    const jobsUserApplied = await appliedApplication.aggregate([
  {
    $lookup: {
      from: "newjobs",
      let: { jobIdStr: "$jobId" }, // jobId from appliedApplication
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", { $toObjectId: "$$jobIdStr" }] // convert string → ObjectId
            }
          }
        }
      ],
      as: "JobsUserApplied"
    }
  }
]);

    
    
    if(!jobsUserApplied){
      return res.status(404).json({message:'User not applied for any job'})
    }
    
    return res.status(200).json({message:'Applied jobs by User',jobsUserApplied});
  } catch (err) {
    
    return res.status(500).json({ message: "Server error" });
  }
};

const allAppliedApplication = async(req,res)=>{
  try{
    
          const allApplication  =  await appliedApplication.find()
          
          if(!Array.isArray(allApplication)||allApplication.length===0){
            return res.status(400).json({message:'No user has applied jobs yet'})
          }
          return res.status(200).json({message:'All applied JObs',allApplication})
  }catch(err){
        return res.status(500).json({message:'Internal Server Error'})
  }
}

const filteredJobs = async (req, res) => {
  const { roles, state, city, salary } = req.body;
  

  try {
    const query = {};

  
    if (roles) {
      query["jobDetails.jobTitle"] =  roles ; 
    }
    
    if (state) {
      query["jobDetails.state"] = state ;
    }

    if (city) {
      query["jobDetails.city"]= city;
    }

    if (salary) {
      query["Compensation.salary"] = { $lte: salary }; 
    }
    

    const filteredJobs = await Job.find(query)
    if(!filteredJobs){
    return res.status(404).json({message:'No Filtered Jobs'})
    }
    
    res.status(200).json({message:'Filtered Jobs',filteredJobs});
  } catch (err) {
    
    res.status(500).json({ error: 'Server error while filtering jobs' });
  }
};

const sendEmailUser = async(req,res)=>{
      const {name,email,skill,company} = req.body;
      try{
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abc587691@gmail.com',
    pass: 'noyzhcvnclnqzjgo'  // NOT your real Gmail password
  }
});

const mailOptions = {
  from: 'abc587691@gmail.com',
  to: email,
  subject: 'Application Received',
  html: `<p>Dear ${name},<br/> 
  <br/>
  Thank you for applying for the ${skill} position at ${company}.We
  appreciate your interest in joining our team.
  We have successfully received your application and will be 
  reviewing your profile in the coming days.If 
  your qualification match our requirements,our team 
  will get in touch with you for the next steps<br/>
    <br/>
  Best regards <br/>
  HR Team<br/>

  ${company}</p>`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    
    res.status(200).json({message:'Email Sent'})
  }
});


      }catch(err){
      
        res.status(400).json({message:'error'})
      }
  
}

const fetchSearchJobs = async (req, res) => {
  
  let {search} = req.query;
  console.log(search,'search')
  search = String(search);

  try {
    const jobs = await Job.find({
      'jobDetails.jobTitle': { $regex: search, $options: 'i' }
    });

    if (jobs.length === 0) {
      // No jobs found case
      return res.status(200).json({ message: 'No jobs found', jobs: [] });
    }

    // Jobs found case
    res.status(200).json({ jobs });

  } catch (err) {
    
    res.status(500).json({ message: 'Error while fetching jobs' });
  }
};


const editProfile = async (req, res) => {
  const formData  = req.body;
  

  try {
    
    const user = await User.findOne({ email: formData.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const updatedUser = await User.findOneAndUpdate(
      { email: formData.email },
      { $set: formData },
      { new: true } 
    );

    return res.status(200).json({ message: 'Profile updated successfully',updatedUser });
  } catch (err) {
  
    return res.status(500).json({ message: 'Server error' });
  }
};

const fetchPersonalInfoOfUser = async(req,res)=>{
    try{
      const userId  = req.params.userId;

 const existingUser =  await User.findById(userId)
 if(!existingUser){
  return res.status(401).json({message:'User not found'})
 }
 
 return res.status(200).json({message:'User found',existingUser})
    }catch(err){
      return res.status(501).json({messge:'Internal Server error'})
    }
  

}

const fetchAllNotificationsOfUser = async(req,res)=>{
  try{
    
    const userId = req.params.userId.trim();
    
    
   const notifications = await Notification.find({userId});
   
   if(!notifications || notifications.length === 0){
    return res.status(404).json({message:'No Notifications for the User'})
   }
   return res.status(200).json({message:'Notification fetched',notifications})
  }catch(err){
    
    res.status(501).json({message:'Internal Server error'})
  }
}

const saveNotifications = async(req,res)=>{
  try{
    const {company,skill,userId}=req.body;
  if(!company||!skill||!userId){
   return res.status(400).json({message:'Data not provided'})
  }
 const notification = new Notification({company,skill,userId})
 await notification.save();
 return res.status(201).json({message:'Notification saved'})
  }catch(err){
    return res.status(500).json({message:'Internal Server error'})
  }
  
}

const deleteNotification = async(req,res)=>{
    try{
   const id = req.params.id;
   if(!id){
    return res.status(404).json({message:'Not found'})
   }
   const deleted = await Notification.findByIdAndDelete(id)
   if (!deleted) {
  return res.status(404).json({ message: 'Notification not found' });
}
   return res.status(200).json({message:'Item deleted'})
    }catch(err){
    return res.status(500).json({message:'Internal server error'})
    }
}

const adminDeleteJob = async(req,res)=>{
  try{
    
    const jobId =  req.params.jobId;
  
    if(!jobId){
      return res.status(404).json({message:'NO job to delete'})
    }
    const deletedJob = await Job.findByIdAndDelete(jobId)
    if(!deletedJob){
      return res.status(404).json({message:'No job to delete'})
    }
    return res.status(200).json({message:'JOb deleted',deletedJob})
  }catch(err){
    return res.status(500).json({message:'Server Error'})
  }
}

const fetchAppliedApplicationForButton = async(req,res)=>{
  try{
           const jobId = req.params.jobId
           const applicationExist = await appliedApplication.find({jobId})
           return res.status(200).json({message:'Applications',applicationExist})
  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const saveUrl = async(req,res)=>{
  try{
   const userId  = req.params.userId


   const {userProfilePicUrl} = req.body
   
   if(!userId) return res.status(404).json({message:'User not found'})
     
   const updatedUser =  await User.findByIdAndUpdate(userId,
      {$set:{userProfilePicUrl}},
      {new:true}
    )
    
    if(!updatedUser) return res.status(400).json({message:'No user to update'})
      return res.status(200).json({message:'User updated'})

     

  }catch(err){
    return res.status(500).json({message:'Internal Server Error',err})
  }
}

const isAppliedJob = async (req, res) => {
  try {
    
 
    const { jobId,userId } = req.body;  // frontend only sends jobId
    

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const jobExist = await appliedApplication.findOne({ jobId, userId });
  

    if (!jobExist) {
      return res.status(200).json({ jobExist: false, message: "Job not applied" });
    } else {
      return res.status(200).json({ jobExist: true, message: "Job already applied" });
    }
  } catch (err) {
    
    return res.status(500).json({ message: "Internal error" });
  }
};

const bookmarkedLength = async(req,res)=>{
  try{

    const userId = req.user.id
    const bookmarkedLength = await savedBookmarkedJobs.find({userId})
    if(!bookmarkedLength){
      return res.status(400).json({message:'No bookamrked jobs'})
    }
    
    return res.status(200).json({message:'bookmarked jobs',bookmarkedLength})

  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const fetchUserInterviewScheduled = async (req, res) => {
  try {
    const userId = req.user.id;

    const InterviewScheduled = await applicationStatus.aggregate([
      {
        $match:{
          status:'Interview scheduled',
          userId
        }
      },
        {
          $lookup:{
          from:'appliedapplications',
          let:{jobIdObj:{$toObjectId:'$jobId'}},
          pipeline:[
             {
              $match:{$expr:{$eq:['$_id','$$jobIdObj']}}
             }
          ],
          as:'interviewScheduled'
        }
      },
      {
    $unwind: '$interviewScheduled'   
  },
      {
        $lookup:{
          from:'newjobs',
          let:{jobIdObj:{$toObjectId:'$interviewScheduled.jobId'}},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:['$_id','$$jobIdObj']
                }
              }
            }
          ],
          as:'finalInterviewedScheduled'
        }
        }  
    ])

    
    return res.json(InterviewScheduled);

  } catch (err) {
  
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const fetchRejected = async(req,res)=>{

  try {
    const userId = req.user.id;

    const Rejected = await applicationStatus.aggregate([
      {
        $match:{
          status:'reject',
          userId
        }
      },
        {
          $lookup:{
          from:'appliedapplications',
          let:{jobIdObj:{$toObjectId:'$jobId'}},
          pipeline:[
             {
              $match:{$expr:{$eq:['$_id','$$jobIdObj']}}
             }
          ],
          as:'rejected'
        }
      },
      {
    $unwind: '$rejected'   
  },
      {
        $lookup:{
          from:'newjobs',
          let:{jobIdObj:{$toObjectId:'$rejected.jobId'}},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:['$_id','$$jobIdObj']
                }
              }
            }
          ],
          as:'finalrejected'
        }
        }  
    ])

    
    return res.json(Rejected);

  } catch (err) {

    return res.status(500).json({ message: 'Internal Server Error' });
  }

}

const fetchSelected = async(req,res)=>{

  try {
    const userId = req.user.id;

    const Selected = await applicationStatus.aggregate([
      {
        $match:{
          status:'selected',
          userId
        }
      },
        {
          $lookup:{
          from:'appliedapplications',
          let:{jobIdObj:{$toObjectId:'$jobId'}},
          pipeline:[
             {
              $match:{$expr:{$eq:['$_id','$$jobIdObj']}}
             }
          ],
          as:'selected'
        }
      },
      {
    $unwind: '$selected'   
  },
      {
        $lookup:{
          from:'newjobs',
          let:{jobIdObj:{$toObjectId:'$selected.jobId'}},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:['$_id','$$jobIdObj']
                }
              }
            }
          ],
          as:'finalSelected'
        }
        }  
    ])


    return res.json(Selected);

  } catch (err) {
    
    return res.status(500).json({ message: 'Internal Server Error' });
  }

}

const fetchUnderReview = async(req,res)=>{
try {
    const userId = req.user.id;

    const UnderReview = await applicationStatus.aggregate([
      {
        $match:{
          status:'under review',
          userId
        }
      },
        {
          $lookup:{
          from:'appliedapplications',
          let:{jobIdObj:{$toObjectId:'$jobId'}},
          pipeline:[
             {
              $match:{$expr:{$eq:['$_id','$$jobIdObj']}}
             }
          ],
          as:'underreview'
        }
      },
      {
    $unwind: '$underreview'   
  },
      {
        $lookup:{
          from:'newjobs',
          let:{jobIdObj:{$toObjectId:'$underreview.jobId'}},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:['$_id','$$jobIdObj']
                }
              }
            }
          ],
          as:'finalUnderReview'
        }
        }  
    ])

  
    return res.json(UnderReview);

  } catch (err) {

    return res.status(500).json({ message: 'Internal Server Error' });
  }

}

const fetchShortlisted = async(req,res)=>{
  
  try {
    const userId = req.user.id;

    const Shortlisted = await applicationStatus.aggregate([
      {
        $match:{
          status:'shortlisted',
          userId
        }
      },
        {
          $lookup:{
          from:'appliedapplications',
          let:{jobIdObj:{$toObjectId:'$jobId'}},
          pipeline:[
             {
              $match:{$expr:{$eq:['$_id','$$jobIdObj']}}
             }
          ],
          as:'shortlisted'
        }
      },
      {
    $unwind: '$shortlisted'   
  },
      {
        $lookup:{
          from:'newjobs',
          let:{jobIdObj:{$toObjectId:'$shortlisted.jobId'}},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:['$_id','$$jobIdObj']
                }
              }
            }
          ],
          as:'finalShortlisted'
        }
        }  
    ])

    
    return res.json(Shortlisted);

  } catch (err) {
    
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}






module.exports = {
  createNewUser, 
  deleteNotification,
  editProfile, 
  filteredJobs,
  saveNotifications, 
  fetchAllNotificationsOfUser,
  loginUser, 
  fetchPersonalInfoOfUser,
  fetchSearchJobs, 
  sendEmailUser,
  fetchUserAppliedApplications, 
  createNewJob,
  fetchAllJobs, 
  saveUserAppliedApplications,
  createBookmarkJobs, 
  deleteBookmarkedJobs,
  fetchBookmarkJobs, 
  UserforgetPassword,
  changeUserPassword, 
  fetchIndividualJobWithId,
  allAppliedApplication,
  adminDeleteJob,
  fetchAppliedApplicationForButton,
  saveUrl,
  isAppliedJob,
  bookmarkedLength,
  fetchUserInterviewScheduled,
  fetchRejected,
  fetchSelected,
  fetchUnderReview,
  fetchShortlisted,
  
}
