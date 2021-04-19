/* eslint-disable no-unused-vars */
const path = require('path');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// eslint-disable-next-line valid-jsdoc
/** @route GET admin/user
 *   @desc Returns all users
 *   @access Public
 */
exports.support = async function(req, res) {
  const {fullName} = req.body;
  const {email} = req.body;
  const {subject} = req.body;
  const {help} = req.body;
  const {message} = req.body;
  // send email
  const mailOptions = {
    to: 'tapmeet@gmail.com',
    from: 'Keyframe <' + process.env.FROM_EMAIL + '>',
    templateId: 'd-76d05aa865a34d659eb6b07f3959243c',
    dynamic_template_data: {
      fullName: fullName,
      email: email,
      subject: subject,
      help: help,
      message: message,
    },
  };

  sgMail.send(mailOptions, (error, result) => {
    if (error) return res.status(500).json({message: error.message});
    res
        .status(200)
        .json({message: 'Your ticket has been submitted successful. One of our team member will be in touch with you soon'});
  });
};
