import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: '',
    status: 'idle',
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
        },
        setAuthStatus: (state, action) => {
            state.status = action.payload
        },
        setAuthError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setCredentials, setAuthStatus, setAuthError } = authSlice.actions
export default authSlice.reducer