const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
// const bcrypt = require('bcryptjs');
// const { BadRequestError } = require('../errors');
// const jwt =  require('jsonwebtoken')

const register = async(req,res) => {
    //opt 1: manual way of error checking:
    // const {name,email,password} = req.body;
    // if (!name || !email || !password) {
    //     throw new BadRequestError('Please provide name, email & password');
    // }
    // const {name,email,password} = req.body;

    // const salt = await bcrypt.genSalt(10); //random bytes are created here
    // const hashPassword = await bcrypt.hash(password,salt) //combining the salt with password 

    // const tempUser = {name:name,email:email,password:hashPassword}
    // const user = await User.create({...tempUser})//opt 2: mongoose doing all validation 
    const user = await User.create({...req.body})//opt 2: mongoose doing all validation 

    // const token = await jwt.sign(
    //     {userId:user._id,name:user.name},
    //     'jwtSecret',
    //     {expiresIn:'30d'} //in seconds, just give 30
    // );
    const token = user.createJWT(); //created using mongoose intance methods

    // res.status(StatusCodes.CREATED).json({user:user})
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token:token})
}

const login = async(req,res) => {
    const {email,password} = req.body;
    //check if email n password is inputted
    if(!email || !password) {
        throw new BadRequestError('Please provide email ID and password');
    }

    const user = await User.findOne({email:email})
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    //Compare password:
    const isPasswordCorrect = await user.comparePassword(password); //gives true or false response
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }
    //create token:
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token:token})
}

module.exports = {register,login}


    //Hashing =  generate randome bytes and combining with password
    //Hashing maps data of any size to bit stream of particular size
    //Used to protect password and helps to verify the correct password
    //Library called bcrypt.js
    //Hashing way is irreversible

