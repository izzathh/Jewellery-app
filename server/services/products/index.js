const Product = require('../../models/Product')

module.exports = {
    getProductById: async (id) => {
        const product = await Product.findById(id)
        return product
    },

    getAllProducts: async (query, options) => {
        const products = await Product.paginate(query, options)
        return products
    },

    createNewProduct: async (data, image) => {
        const product = await Product.create({
            ...data,
            image
        });
        return product
    },

    updateProductById: async (id, updates) => {
        const product = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
        return product
    },

    deleteProductById: async (id) => {
        const product = await Product.findByIdAndDelete(id)
        return product
    },

    findFilteredCategories: async (search) => {
        const pipeline = [];
        if (search) {
            pipeline.push({
                $match: {
                    category: { $regex: search, $options: 'i' }
                }
            });
        }
        pipeline.push(
            {
                $group: {
                    _id: "$category",
                    category: { $first: "$category" },
                    docId: { $first: "$_id" }
                }
            },
            {
                $project: {
                    _id: "$docId",
                    category: 1
                }
            }
        );

        const categories = await Product.aggregate(pipeline);
        return categories;
    },
}