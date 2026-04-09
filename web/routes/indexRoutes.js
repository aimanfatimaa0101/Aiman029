const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');

// Home Page
router.get('/', async (req, res) => {
  res.render('home', { title: 'SkillLink - Freelance Marketplace' });
});

// Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    if (req.session.role === 'Client') {
      const jobs = await Job.find({ createdBy: req.session.userId }).sort({ createdAt: -1 });
      const proposals = await Proposal.find({ job: { $in: jobs.map(j => j._id) } })
                                      .populate('freelancer', 'name email')
                                      .populate('job', 'title');
      res.render('dashboard-client', { title: 'Client Dashboard', jobs, proposals });
    } else {
      const proposals = await Proposal.find({ freelancer: req.session.userId })
                                      .populate('job')
                                      .sort({ createdAt: -1 });
      res.render('dashboard-freelancer', { title: 'Freelancer Dashboard', proposals });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
