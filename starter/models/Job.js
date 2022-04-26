const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,'Please provide position'],
        maxlength:10
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy:{ //tieing the UserSchema to JobSchema - tieing each job to a user
        type:mongoose.Types.ObjectId,
        ref:'User',//reference model name
        required:[true,'Please provide user']
    }
},{timestamps:true}); //gives createdAt and updatedAt date n time props by default in job object

module.exports = mongoose.model('Job',JobSchema);