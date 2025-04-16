import { Route, Routes } from "react-router-dom"

import { LoginPage, ProductsManagementPage } from "../pages"
import Protected from "./protected"
import Layout from '../components/Layout';

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<Protected />}>
                    <Route
                        path="/manageproducts"
                        element={
                            <Layout>
                                <ProductsManagementPage />
                            </Layout>
                        }
                    />
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes