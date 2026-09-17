class ErrorHandler extends Error {
  constructor(message , statusCode){
    super(message)
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);  // It helps you identify where the error originated.
  }
}


module.exports =  ErrorHandler;