const Proposal = require('../models/Proposal');
const Job = require('../models/Job');

exports.submitProposal = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { coverLetter, bidAmount } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Open') {
      req.flash('error_msg', 'Job is no longer open for proposals');
      return res.redirect(`/jobs/${jobId}`);
    }

    const existingProposal = await Proposal.findOne({ job: jobId, freelancer: req.session.userId });
    if (existingProposal) {
      req.flash('error_msg', 'You have already submitted a proposal for this job');
      return res.redirect(`/jobs/${jobId}`);
    }

    const proposal = new Proposal({
      job: jobId,
      freelancer: req.session.userId,
      coverLetter,
      bidAmount
    });

    await proposal.save();
    req.flash('success_msg', 'Proposal submitted successfully');
    res.redirect(`/dashboard`);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to submit proposal');
    res.redirect(`/jobs/${req.params.jobId}`);
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { action } = req.body; // 'Accept' or 'Reject'
    
    const proposal = await Proposal.findById(proposalId).populate('job');
    if (!proposal) {
      req.flash('error_msg', 'Proposal not found');
      return res.redirect('/dashboard');
    }

    if (proposal.job.createdBy.toString() !== req.session.userId) {
      req.flash('error_msg', 'Unauthorized to modify this proposal');
      return res.redirect('/dashboard');
    }

    if (action === 'Accept') {
      proposal.status = 'Accepted';
      await proposal.save();
      
      // Update Job status
      proposal.job.status = 'In Progress';
      await proposal.job.save();

      // Implement Logic: Reject all other pending proposals for this job
      await Proposal.updateMany(
        { job: proposal.job._id, _id: { $ne: proposal._id }, status: 'Pending' },
        { status: 'Rejected' }
      );

      req.flash('success_msg', 'Proposal accepted and job is now In Progress');
    } else if (action === 'Reject') {
      proposal.status = 'Rejected';
      await proposal.save();
      req.flash('success_msg', 'Proposal rejected');
    }

    res.redirect(`/jobs/${proposal.job._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
