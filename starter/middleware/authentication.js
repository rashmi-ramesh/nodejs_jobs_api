const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthenticatedError } = require('../errors');

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    //verify token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, name } = payload //i.e. what is passesed in payload in jwt.sign
        req.user = {userId:userId,name:name}
        // //Other way:
        // const user = User.findById(payload.id).select('-password');
        // console.log(user)
        // //fining the user by ID and removing the password field using select method 
        // req.user = user
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = authentication;