const Router = require('express').Router()
const { handleValidation, validate } = require('../middleware/validator')

const { authController } = require('../controllers')

Router.route('/login').post(
    validate('login'),
    handleValidation,
    authController.loginAdmin
)

Router.route('/logout').post(authController.logoutAdmin)

module.exports = Router