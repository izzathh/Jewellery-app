const { StatusCodes } = require('http-status-codes')

class GeneralError extends Error {
    constructor(message) {
        super(message)
        this.message = message
    }

    getCode() {
        if (this instanceof BadRequest) return StatusCodes.BAD_REQUEST
        if (this instanceof NotFound) return StatusCodes.NOT_FOUND
        if (this instanceof UnAuthorized) return StatusCodes.UNAUTHORIZED
        if (this instanceof Forbidden) return StatusCodes.FORBIDDEN
        return StatusCodes.INTERNAL_SERVER_ERROR
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class UnAuthorized extends GeneralError { }
class Forbidden extends GeneralError { }

module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    UnAuthorized,
    Forbidden
}