const passport = require("passport");

module.exports = (req, res, next) => {
    passport.authenticate('jwt', function (err, user, info) {
        if (err) return next(err);
        console.log(user)
        if (!user) return res.status(200).json({ message: "Unauthorized Access - No Token Provided!" });

        req.user = user;

        next();

    })(req, res, next);
};