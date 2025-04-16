const express = require('express')
const router = express.Router()
 

const {getAllJobs, getJob, createJob, updateJob, deleteJob} = require('../controllers/jobs')


router.post('/createJob')
router.get('/getAllJobs')
router.get('/getJob')
router.patch('/updateJob')
router.delete('/deleteJob')

module.exports = router