class ApiError extends Error{
  constructor(
    statusCode,
    message="Something went wronng",
    error=[],
    stack= ""
  ){
    super(message)
    this.message = message
    this.data = null
    this.statusCode = statusCode
    this.success = false
    this.errors= error
    this.stack= stack
  }
}

export {ApiError}