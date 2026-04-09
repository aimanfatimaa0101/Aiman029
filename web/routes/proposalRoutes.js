const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { isAuthenticated, isFreelancer, isClient } = require('../middleware/auth');

router.post('/:jobId', isAuthenticated, isFreelancer, proposalController.submitProposal);
router.post('/update/:proposalId', isAuthenticated, isClient, proposalController.updateProposalStatus);

module.exports = router;
