const upload = require('../utils/multer')
const Router = require('express').Router()
const authorize = require('../middleware/auth')
const { handleValidation, validate } = require('../middleware/validator')

const { productController } = require('../controllers')

Router.route('/list').get(
    authorize(),
    productController.listProduct
)

Router.route('/add').post(
    authorize(),
    upload.single('image'),
    validate('createProduct'),
    handleValidation,
    productController.addProduct
)

Router.route('/update/:id').put(
    authorize(),
    upload.single('image'),
    validate('updateProduct'),
    handleValidation,
    productController.editProduct
)

Router.route('/delete/:id').delete(
    authorize(),
    productController.deleteProduct
)

Router.route('/autocomplete').get(
    authorize(),
    productController.getCategorySugg
)

module.exports = Router