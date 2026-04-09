const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { isAuthenticated, isClient } = require('../middleware/auth');

router.get('/', jobController.getAllJobs);
router.get('/new', isAuthenticated, isClient, jobController.showCreateForm);
router.post('/', isAuthenticated, isClient, jobController.createJob);
router.get('/:id', jobController.getJobDetails);
router.get('/:id/edit', isAuthenticated, isClient, jobController.showEditForm);
router.put('/:id', isAuthenticated, isClient, jobController.updateJob);
router.delete('/:id', isAuthenticated, isClient, jobController.deleteJob);

module.exports = router;
