const authController = require('./auth')
const productController = require('./products')
const adminController = require('./admin')

module.exports = {
    productController,
    authController,
    adminController
}