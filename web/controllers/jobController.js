const Job = require('../models/Job');
const Proposal = require('../models/Proposal');

exports.getAllJobs = async (req, res) => {
  try {
    const { search, status, minBudget, maxBudget } = req.query;
    let query = {};
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const jobs = await Job.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.render('jobs/index', { title: 'Browse Jobs', jobs, search, status, minBudget, maxBudget });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).send('Job not found');

    let proposals = [];
    let hasApplied = false;

    if (req.session.userId) {
      if (req.session.role === 'Client' && req.session.userId === job.createdBy._id.toString()) {
        proposals = await Proposal.find({ job: job._id }).populate('freelancer', 'name email').sort({ createdAt: -1 });
      } else if (req.session.role === 'Freelancer') {
        const existingProposal = await Proposal.findOne({ job: job._id, freelancer: req.session.userId });
        if (existingProposal) hasApplied = true;
      }
    }

    res.render('jobs/show', { title: job.title, job, proposals, hasApplied });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.showCreateForm = (req, res) => {
  res.render('jobs/new', { title: 'Post a Job' });
};

exports.createJob = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const newJob = new Job({
      title,
      description,
      budget,
      createdBy: req.session.userId
    });
    await newJob.save();
    req.flash('success_msg', 'Job posted successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to create job');
    res.redirect('/jobs/new');
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');

    if (job.createdBy.toString() !== req.session.userId) {
      req.flash('error_msg', 'Unauthorized access');
      return res.redirect('/dashboard');
    }
    res.render('jobs/edit', { title: 'Edit Job', job });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');

    if (job.createdBy.toString() !== req.session.userId) {
      req.flash('error_msg', 'Unauthorized access');
      return res.redirect('/dashboard');
    }

    const { title, description, budget, status } = req.body;
    job.title = title;
    job.description = description;
    job.budget = budget;
    if (status) job.status = status;

    await job.save();
    req.flash('success_msg', 'Job updated successfully');
    res.redirect(`/jobs/${job._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');

    if (job.createdBy.toString() !== req.session.userId) {
      req.flash('error_msg', 'Unauthorized access');
      return res.redirect('/dashboard');
    }

    await Proposal.deleteMany({ job: job._id });
    await Job.deleteOne({ _id: job._id });
    
    req.flash('success_msg', 'Job deleted successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
