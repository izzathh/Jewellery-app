import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { productsService } from "../../services/product"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from "react-datepicker";
import { handleErrors, showConfirmDialog, showToaster, formatDate } from '../../utils/common';
import { productValidationSchema } from '../../utils/validators';
import debounce from 'lodash.debounce';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('-createdAt');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categorySuggestions, setCategorySuggestions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchProducts(0);
    }, [currentPage, searchTerm, selectedCategory, sortOrder]);

    const fetchProducts = async (type) => {
        try {
            setLoading(true);
            const data = await productsService.list({
                params: {
                    page: currentPage,
                    search: searchTerm,
                    category: selectedCategory,
                    sort: sortOrder
                }
            })
            if (categories.length === 0 || type === 1) {
                refreshCategories(data.data.products)
            }
            setProducts(data.data.products);
            setTotalPages(data.data.summary.totalPages);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const refreshCategories = (cat) => {
        const uniqueCategory = cat.reduce((acc, cat) => {
            if (!acc.includes(cat.category)) acc.push(cat.category)
            return acc;
        }, []);
        setCategories(uniqueCategory)
    }

    const handleDelete = async (productId) => {
        await showConfirmDialog({
            title: 'Delete Confirmation',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
            customClass: {
                confirmButton: 'bg-green-50 text-green-800 px-4 py-2 rounded-md mr-2 hover:bg-green-100 transition-colors',
                cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300'
            },
            onConfirm: async () => {
                try {
                    const data = await productsService.delete(productId)
                    fetchProducts(1);
                    showToaster(data.status, data.message)
                } catch (error) {
                    handleErrors(error)
                }
            },
            onCancel: () => {
                console.log('Deletion cancelled.');
                return
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = useCallback(
        debounce(async (query) => {
            if (!query) {
                setCategorySuggestions([]);
                setDropdownOpen(false);
                return;
            }
            try {
                const data = await productsService.autoCompleteCategory({
                    params: { search: query }
                });
                setCategorySuggestions(data.data);
                setDropdownOpen(data.data.length > 0);
            } catch (error) {
                console.error(error);
                setCategorySuggestions([]);
                setDropdownOpen(false);
            }
        }, 300),
        []
    );

    const openEditModal = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Add Product
                    </button>
                </div>

                <div className="mb-6 flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-lg w-full sm:w-64"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 border rounded-lg bg-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="p-2 border rounded-lg bg-white"
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                    </select>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : (
                        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFG</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products && products.map(product => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/products/${product.image}`}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(product.manufacturingDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md mr-2 hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="bg-red-50 text-red-800 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>

                {showModal && (
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]"
                        onClick={closeModal}
                    >
                        <div
                            className="bg-white rounded-lg p-6 w-full max-w-2xl relative z-[1001]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <Formik
                                initialValues={{
                                    name: editingProduct ? editingProduct.name : '',
                                    price: editingProduct ? editingProduct.price : '',
                                    stock: editingProduct ? editingProduct.stock : '',
                                    description: editingProduct ? editingProduct.description : '',
                                    category: editingProduct ? editingProduct.category : '',
                                    existingImage: editingProduct ? editingProduct.image : '',
                                    image: editingProduct ? editingProduct.image : null,
                                    manufacturingDate: editingProduct ? new Date(editingProduct.manufacturingDate) : new Date(),
                                }}
                                validationSchema={productValidationSchema}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    const formPayload = new FormData();
                                    formPayload.append('name', values.name);
                                    formPayload.append('price', values.price);
                                    formPayload.append('description', values.description || '');
                                    formPayload.append('category', values.category);
                                    formPayload.append('stock', values.stock);
                                    formPayload.append('manufacturingDate', values.manufacturingDate.toISOString());
                                    if (values.image instanceof File) {
                                        formPayload.append('image', values.image);
                                    } else if (editingProduct && values.existingImage) {
                                        formPayload.append('image', values.existingImage);
                                    }
                                    (async () => {
                                        try {
                                            if (editingProduct) {
                                                const data = await productsService.update(formPayload, editingProduct._id)
                                                showToaster(data.status, data.message)
                                            } else {
                                                const data = await productsService.create(formPayload)
                                                showToaster(data.status, data.message)
                                            }
                                            closeModal();
                                            fetchProducts(1);
                                        } catch (error) {
                                            toast.error('Operation failed');
                                            console.error('Submission error:', error);
                                        } finally {
                                            setSubmitting(false);
                                            resetForm();
                                        }
                                    })();
                                }}
                            >
                                {({ setFieldValue, values, errors, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="w-full md:w-1/2 space-y-4">
                                                <div className="flex justify-center">
                                                    <div className="flex items-center w-full">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setFieldValue('image', file);
                                                                    setFieldValue('existingImage', '');
                                                                    setFieldValue('previewImage', URL.createObjectURL(file));
                                                                }
                                                            }}
                                                            accept="image/*"
                                                            className="hidden"
                                                            id="imageInput"
                                                        />
                                                        <label
                                                            htmlFor="imageInput"
                                                            className="w-full cursor-pointer border-dashed border-2 border-gray-300 p-4 rounded-lg flex flex-col items-center"
                                                        >
                                                            {values.image || values.existingImage ? (
                                                                <img
                                                                    src={
                                                                        values.image instanceof File
                                                                            ? URL.createObjectURL(values.image)
                                                                            : `${import.meta.env.VITE_API_URL}/uploads/products/${values.existingImage}`
                                                                    }
                                                                    alt="Preview"
                                                                    className="w-full h-32 object-contain rounded"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                    <span className="text-sm text-gray-600 mt-2">Click to upload image</span>
                                                                </>
                                                            )}
                                                        </label>
                                                        <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Field
                                                        as="textarea"
                                                        name="description"
                                                        placeholder="Description"
                                                        className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        rows="6"
                                                    />
                                                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="w-full md:w-1/2 space-y-4">
                                                <div>
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        placeholder="Product Name"
                                                        className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                                <div>
                                                    <Field
                                                        name="price"
                                                        type="number"
                                                        placeholder="Price"
                                                        className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                                <div>
                                                    <Field
                                                        name="stock"
                                                        type="number"
                                                        placeholder="Stock"
                                                        className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                                <Field name="category">
                                                    {({ field, form }) => (
                                                        <div className="relative">
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                placeholder="Search category..."
                                                                onChange={(e) => {
                                                                    form.setFieldValue("category", e.target.value);
                                                                    fetchSuggestions(e.target.value);
                                                                    setDropdownOpen(true);
                                                                }}
                                                                onFocus={() => setDropdownOpen(true)}
                                                                className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            {dropdownOpen && categorySuggestions.length > 0 && (
                                                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                                    {categorySuggestions.map((categoryObj, index) => (
                                                                        <div
                                                                            key={index}
                                                                            onClick={() => {
                                                                                form.setFieldValue("category", categoryObj.category);
                                                                                setDropdownOpen(false);
                                                                            }}
                                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                                                                        >
                                                                            {categoryObj.category}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                                                        </div>
                                                    )}
                                                </Field>


                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Manufacturing Date
                                                    </label>
                                                    <Field name="manufacturingDate">
                                                        {({ field, form }) => (
                                                            <DatePicker
                                                                selected={field.value}
                                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                                                dateFormat="MMMM d, yyyy"
                                                                className="w-full py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                showPopperArrow={false}
                                                            />
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="manufacturingDate" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                {editingProduct ? 'Update Product' : 'Add Product'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default ProductManagement;