/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */

const Datauri = require('datauri');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');


/** @route GET admin/user
*   @desc Returns all users
*   @access Public
*/
exports.index = async function(req, res) {
  const users = await User.find({});
  res.status(200).json({users});
};

/** @route GET api/user/{id}
* @desc Returns a specific user
* @access Public
*/
exports.show = async function(req, res) {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({message: 'User does not exist'});

    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

/** @route PUT api/user/{id}
*   @desc Update user details
*   @access Public
*/
exports.update = async function(req, res) {
  try {
    const {id} = req.body;
    const {email, password, newPassword} = req.body;
    // Make sure the passed id is that of the logged in user
    if (typeof email === 'undefined') {
      const user = await User.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true, useFindAndModify: false});
      const users = await User.findOne({_id: id});

      res.status(200).json({token: users.generateJWT(), message: 'User has been updated'});
    } else {
      const user = await User.findOne({email});

      if (!user.comparePassword(password)) return res.status(401).json({message: 'Invalid current password'});

      // Set the new password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.isVerified = true;

      // Save
      user.save((err) => {
        if (err) return res.status(500).json({message: err.message});
        res.status(200).json({message: 'Your password has been updated.'});
      });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

/** @route DESTROY api/user/{id}
*   @desc Delete User
*   @access Public
*/
exports.destroy = async function(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user._id;

    // Make sure the passed id is that of the logged in user
    if (userId.toString() !== id.toString()) return res.status(200).json({message: 'Sorry, you don\'t have the permission to delete this data.'});

    await User.findByIdAndDelete(id);
    res.status(200).json({message: 'User has been deleted'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Upload
exports.upload = async (req, res, next) => {
  try {
    const file = req.file;
    // console.log(file)
    if (file) {
      const filePath = file.path;
      // Save Event Image
      if (filePath) {
        res.status(200).json({message: filePath});
      }
    } else {
      res.status(500).json({message: error.message});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
