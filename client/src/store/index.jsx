import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productReducer from "./slices/products"

export default configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer
    }
})