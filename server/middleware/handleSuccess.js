module.exports = (req, res, next) => {
    res.success = (data = null, message = 'Success', statusCode = 200) => {
        res.status(statusCode).json({ status: 1, message, data })
    }
    next()
}