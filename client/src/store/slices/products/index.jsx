import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    selectedProduct: null,
    status: 'idle',
    error: null,
    filters: {
        category: '',
        priceRange: [0, 10000]
    }
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
            state.status = 'succeeded'
        },
        addProduct: (state, action) => {
            state.products.push(action.payload)
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id)
            if (index !== -1) state.products[index] = action.payload
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload)
        },
        setProductStatus: (state, action) => {
            state.status = action.payload
        },
        setProductError: (state, action) => {
            state.error = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        }
    }
})

export const {
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProductStatus,
    setProductError,
    setFilters
} = productSlice.actions

export default productSlice.reducer