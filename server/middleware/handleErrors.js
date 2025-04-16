const { GeneralError } = require("../utils/errors")

module.exports = (err, req, res, next) => {
    console.error(err);
    if (err instanceof GeneralError)
        return res.status(err.getCode()).json({ status: 0, message: err.message })
    return res.status(500).json({ status: 0, message: err.message })
}