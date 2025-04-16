const fs = require('fs')
const fsPromises = fs.promises;
const { getAllProducts, createNewProduct, getProductById, updateProductById, deleteProductById, findFilteredCategories } = require("../../services/products")
const { NotFound } = require('../../utils/errors')
const path = require('path')

module.exports = {
    fetchProduct: async (req, res, next) => {
        const { id } = req.params
        try {

        } catch (e) {
            next(e)
        }
    },

    listProduct: async (req, res, next) => {
        try {
            const { limit = 10, page = 1, sort, search, category } = req.query

            const query = {}
            if (category) query.category = category
            if (search) {
                const searchTerms = search.trim().split(/\s+/);
                query.$and = searchTerms.map(term => ({
                    name: { $regex: term, $options: 'i' }
                }));
            }

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sort || '-createdAt'
            }

            const products = await getAllProducts(query, options)

            const responseObj = {
                products: products.docs,
                summary: {
                    total: products.totalDocs,
                    page: products.page,
                    limit: products.limit,
                    totalPages: products.totalPages
                }
            }

            res.success(responseObj, 'Products retrieved successfully')
        } catch (e) {
            next(e)
        }
    },

    addProduct: async (req, res, next) => {
        try {
            const product = await createNewProduct(req.body, req.file.filename)
            res.success(product, 'Products retrieved successfully')
        } catch (e) {
            if (req.file) await fsPromises.unlink(req.file.path)
            next(e);
        }
    },

    editProduct: async (req, res, next) => {
        try {
            const product = await getProductById(req.params.id);
            if (!product) throw new NotFound('Product not found');

            const oldImage = product.image;
            const updates = req.body;

            if (req.file) updates.image = req.file.filename;

            const updatedProduct = await updateProductById(req.params.id, updates);

            if (req.file) {
                const imagePath = path.join(__dirname, `../../uploads/products/${oldImage}`);
                await fsPromises.unlink(imagePath);
            }
            res.success(updatedProduct, 'Product updated successfully')
        } catch (error) {
            if (req.file) await fsPromises.unlink(req.file.path)
            next(error);
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            const product = await deleteProductById(req.params.id)
            if (!product) throw new NotFound('Product not found');
            const imagePath = path.join(__dirname, `../../uploads/products/${product.image}`);
            await fsPromises.unlink(imagePath);
            res.success(null, 'Product deleted successfully')
        } catch (e) {
            next(e)
        }
    },

    getCategorySugg: async (req, res, next) => {
        try {
            const data = await findFilteredCategories(req.query.search)
            res.success(data)
        } catch (e) {
            next(e)
        }
    }
}