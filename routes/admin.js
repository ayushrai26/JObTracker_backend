const express = require('express')
const router = express.Router()

const {createAdmin,
    saveApplicationStatus,
    fetchApplicationStatus,
    fetchShortlistedCandidate,
    fetchInterviewScheduledCandidates,
    fetchInterviewedCandidates,
    fetchSelectedCandidates,
   fetchRejectedCandidates,
  fetchUnderReviewCandidates} = require('../controllers/adminController')

router.post('/createAdmin',createAdmin);
router.post('/save-application-status/:jobId',saveApplicationStatus)
router.get('/fetch-application-status',fetchApplicationStatus)
router.get('/fetch-shortlisted-candidate',fetchShortlistedCandidate)
router.get('/fetch-interview-scheduled-candidates',fetchInterviewScheduledCandidates)
router.get('/fetch-interviewed-candidates',fetchInterviewedCandidates)
router.get('/fetch-selected-candidates',fetchSelectedCandidates)
router.get('/fetch-rejected-candidates',fetchRejectedCandidates)
router.get('/fetch-under-review-candidates',fetchUnderReviewCandidates)

module.exports = router;