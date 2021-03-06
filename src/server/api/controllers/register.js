const mongoose = require('mongoose');
const { generateHash, sendVerificationEmail } = require('./verification')

module.exports = (req, res) => {

    const {
        body: {
            email,
            firstName,
            surname,
            password,
            confirmPassword
        }, body
    } = req;

    //get model for user from mongoose
    const userModel = mongoose.model('User');
    const verificationModel = mongoose.model('Verification');

    //create new instance of user model
    const User = new userModel();
    const Verification = new verificationModel();

    Verification.userId = User._id
    Verification.hash = generateHash(16)

    //store the email sent in the request on the user
    User.email = email;
    User.firstName = firstName;
    User.surname = surname;

    new Promise((resolve, reject) => 
        password === confirmPassword ? resolve(password) : reject(new Error("Passwords do not match."))
    )
    .then(password => User.setPassword(password))
    .then(_ => User.save())
    .then(_ => Verification.save())
    .then(_ => sendVerificationEmail(req.body.email, Verification.hash, req.headers.host))
    .then(_ => {

        // const token = User.createJwt();
        
        //change secure to true when we set up SSL environment
        // res.cookie('jwt', token, { secure: false, httpOnly: true });

        res.json({
            error: false
        });

    })
    .catch(err => {
        console.log(err);
        res.json({
            message: err && err.message,
            error: true
        })
    })
}