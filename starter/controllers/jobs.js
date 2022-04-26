const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs:jobs,count:jobs.length})
}

const getJob = async(req,res) => {
    const {userId} = req.user;
    const {id} = req.params;
    const singleJob = await Job.find({_id:id,createdBy:userId});
    if(!singleJob) {
        throw new NotFoundError(`No Job with id : ${id}`)
    }
    res.status(StatusCodes.OK).json({job:singleJob})
}

const createJob = async(req,res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job:job})
}

const updateJob = async(req,res) => {
    const {userId} = req.user;
    const {id} = req.params;
    const {company,position} = req.body;

    if (company === '' || position === '' || !company || !position) {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const singleJob = await Job.findOneAndUpdate(
        {_id:id,createdBy:userId},
        req.body,
        {new:true,runValidators:true}
    );

    if (!singleJob) {
        throw new NotFoundError(`No job with id : ${id}`)
    }

    res.status(StatusCodes.OK).json({job:singleJob});
}

const deleteJob = async(req,res) => {
    const {id} = req.params;
    const {userId} = req.user;

    const singleJob = await Job.findOneAndRemove({_id:id,createdBy:userId});

    if(!singleJob) {
        throw new NotFoundError(`No job with id : ${id}`)
    }

    res.status(StatusCodes.OK).send(); //not sending json back
}

module.exports = {getAllJobs,getJob,createJob,updateJob,deleteJob}