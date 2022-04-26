// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  //Mongo Error 1 ---> For duplicate email id error while registering new user:
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  //Mongo Error 2 ---> Mongoose validation error: Missing to type props in body or sending ""
  if (err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(','); 
    //errors obj has props like password:{message:""},email:{message:""}
    customError.statusCode = 400
  }

  //Mongo Error 3 ---> Cast Error - when we use wrong IDs by removing or adding chars to ID (used in jobs api)
  if (err.name === 'CastError') {
    customError.msg = `No Item with ID ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg:customError.msg })
}

module.exports = errorHandlerMiddleware
