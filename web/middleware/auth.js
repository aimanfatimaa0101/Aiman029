module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
  },
  isClient: (req, res, next) => {
    if (req.session && req.session.role === 'Client') {
      return next();
    }
    req.flash('error_msg', 'Access denied. Client role required.');
    res.redirect('/dashboard');
  },
  isFreelancer: (req, res, next) => {
    if (req.session && req.session.role === 'Freelancer') {
      return next();
    }
    req.flash('error_msg', 'Access denied. Freelancer role required.');
    res.redirect('/dashboard');
  },
  forwardAuthenticated: (req, res, next) => {
    if (!req.session.userId) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};
