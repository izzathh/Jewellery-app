import { useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { ApiEndpoints } from "../../api/endpoints"
import api from "../../api"

const Protected = () => {
    const [isValidating, setIsValidating] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await api.post(ApiEndpoints.ADMIN_AUTH)
                setIsAuthenticated(true)
            } catch (error) {
                console.error("Auth verification failed:", error)
                setIsAuthenticated(false)
            } finally {
                setIsValidating(false)
            }
        }

        verifyAuth()
    }, [])

    if (isValidating) {
        return <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default Protected