const express = require('express')
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware')
const {
    createNewUser, 
    loginUser,
    createNewJob,
    fetchAllJobs,
    createBookmarkJobs,
    fetchPersonalInfoOfUser,
    fetchAllNotificationsOfUser,
    deleteNotification,
    sendEmailUser,
    fetchSearchJobs,
    editProfile, 
    deleteBookmarkedJobs, 
    fetchBookmarkJobs,
    filteredJobs, 
    UserforgetPassword, 
    changeUserPassword, 
    fetchIndividualJobWithId, 
    saveUserAppliedApplications, 
    fetchUserAppliedApplications, 
    saveNotifications,
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
    
  } = require('../controllers/userController')
  

router.post('/user/signup',createNewUser);
router.put('/edit-profile',editProfile)
router.post('/login',loginUser)
router.post('/new-job',createNewJob)
router.get('/fetch-all-jobs',fetchAllJobs)
router.post('/bookmark-jobs',createBookmarkJobs)
router.post('/fetch-bookmark-jobs',authMiddleware,fetchBookmarkJobs)
router.delete('/delete/bookmarked/job',authMiddleware,deleteBookmarkedJobs)
router.post('/forgetPassword',UserforgetPassword)
router.patch('/changePassword',changeUserPassword)
router.post('/fetch-individual-job',fetchIndividualJobWithId)
router.post('/save/user-applied-applications',saveUserAppliedApplications)
router.get('/fetch/user-applied-applications',authMiddleware,fetchUserAppliedApplications)
router.get('/fetch/all-applied-applications',allAppliedApplication)
router.post('/Jobs/filterJobs',filteredJobs)
router.post('/sendEmail',sendEmailUser)
router.get('/jobs/search-jobs',fetchSearchJobs)
router.get('/personalinfo/:userId',fetchPersonalInfoOfUser)
router.get('/getNotification/:userId',fetchAllNotificationsOfUser)
router.post('/saveNotifications',saveNotifications)
router.delete('/deleteNotification/:id',deleteNotification)
router.delete('/admin/delete-job/:jobId',adminDeleteJob)
router.get('/applied-application/:jobId',fetchAppliedApplicationForButton)
router.patch('/save-profile-pic/:userId',saveUrl)
router.post('/isAppliedJob',isAppliedJob)
router.get('/fetch-bookmark-jobs/length',authMiddleware,bookmarkedLength)
router.get('/fetch/interview-scheduled',authMiddleware,fetchUserInterviewScheduled)
router.get('/fetch/rejected',authMiddleware,fetchRejected)
router.get('/fetch/selected',authMiddleware,fetchSelected)
router.get('/fetch/underReview',authMiddleware,fetchUnderReview)
router.get('/fetch/shortlisted',authMiddleware,fetchShortlisted)


module.exports = router