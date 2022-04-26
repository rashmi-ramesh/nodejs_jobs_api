const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'Please provide an email ID'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email ID'
        ],
        unique:true,//creates a unique index - not a validator
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
        // maxlength:12
    }
})

//MONGOOSE MIDDLEWARE: TO HASH THE PASSWORD
UserSchema.pre('save',async function(next) { //pre runs b4 we save the document
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//MONGOOSE INSTANCE METHODS: TO GEN. TOKEN
//models have access to these methods
UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId:this._id,name:this.name},
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_LIFETIME}
    )
}

//MONGOOSE INSTANCE METHODS: TO COMPARE/CHECK PASSWORD
UserSchema.methods.comparePassword =  async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch; //true or false
}

module.exports = mongoose.model('User',UserSchema);

    //jwt secret:
    //allKeysGenerator.com
    //Encryption Key > 256 bit 
    //copy the key n paste in .env > JWT_SECRET:......