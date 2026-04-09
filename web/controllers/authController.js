const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'Email is already registered.');
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error');
    res.redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Email is not registered');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Password incorrect');
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error');
    res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Session matching issue', err);
    res.redirect('/login');
  });
};
