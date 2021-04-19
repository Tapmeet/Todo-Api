require('dotenv').config();
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = async (req, res) => {
  try {
    const {email} = req.body;

    const user = await User.findOne({email});

    if (!user) return res.status(404).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

    // Generate and set password reset token
    user.generatePasswordReset();

    // Save the updated user object
    user.save()
        .then((user) => {
          // send email
          const link = `${process.env.WEBSITEURL}verification/?useremail=${user.email}&token=${user.resetPasswordToken}`;
          const msg = {
            to: user.email,
            from: 'Keyframe <' + process.env.FROM_EMAIL + '>',
            templateId: 'd-a4ab319a6e974a7e89cc31424194e411',
            dynamic_template_data: {
              sender_name: user.fullName,
              reset_url: link,
            },
            //     subject: 'Password change request',
            //     html: `Hi ${user.email} \n
            //   <br/>Please click on the following link ${link} to reset your password. \n\n
            //   <br/>If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          };
          //  sgMail.send(msg);
          sgMail
              .send(msg)
              .then(() => {
                console.log('Email sent');
              })
              .catch((error) => {
                console.error(error.response.body);
              });

          res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
        })
        .catch((err) => res.status(500).json({message: err.message}));
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
exports.reset = async (req, res) => {
  try {
    const {token} = req.params;

    const user = await User.findOne({resetPasswordToken: token});

    if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
    res.status(200).json({message: ' Successfully Verified'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// @route POST api/auth/reset
// @desc Reset Password
// @access Public
exports.resetPassword = (req, res) => {
  User.findOne({resetPasswordToken: req.params.token})
      .then((user) => {
        if (!user) return res.status(200).json({message: 'Password reset token is invalid or has expired.'});

        // Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;

        // Save
        user.save((err) => {
          if (err) return res.status(500).json({message: err.message});
          const link = `${process.env.WEBSITEURL}login`;
          // send email
          const mailOptions = {
            to: user.email,
            from: 'Keyframe <' + process.env.FROM_EMAIL + '>',
            // subject: "Your password has been changed",
            // text: `Hi ${user.fullName} \n
            // This is a confirmation that the password for your account ${user.email} has just been changed.\n`
            templateId: 'd-6a5602253edc41f68458b24e401110a8',
            dynamic_template_data: {
              sender_name: user.fullName,
              login_url: link,
              sender_email: user.email,
            },
          };

          sgMail.send(mailOptions, (error, result) => {
            if (error) return res.status(500).json({message: error.message});
            console.log(result);
            res.status(200).json({message: 'Your password has been updated.'});
          });
        });
      });
};
