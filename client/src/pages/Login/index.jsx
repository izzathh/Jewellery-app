import { useState } from "react";
import { authService } from "../../services/auth"
import { useDispatch } from 'react-redux'
import { setCredentials, setAuthError, setAuthStatus } from "../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { showToaster } from "../../utils/common";
import { loginValidationSchema } from "../../utils/validators";
import * as Yup from "yup";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginValidationSchema.validate({ email, password }, { abortEarly: false });

            dispatch(setAuthStatus('loading'));
            const data = await authService.login({ email, password, rememberMe });

            if (data.status) {
                navigate('/manageproducts');
                showToaster(data.status, data.message);
                dispatch(setCredentials(data.data));
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setFormErrors(errors);
            } else {
                console.error(error);
                dispatch(setAuthError(error.message));
            }
        } finally {
            dispatch(setAuthStatus('idle'));
        }
    };

    return (
        <div className="min-h-screen relative">
            <img
                className="w-full h-full object-cover absolute inset-0"
                src="https://plus.unsplash.com/premium_photo-1708958142067-f52023835f55?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Technology"
            />

            <div className="absolute right-0 inset-y-0 w-full md:w-1/3 bg-white backdrop-blur-lg flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white py-8 px-4 sm:px-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 text-start"
                            >
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFormErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    className={`appearance-none block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {formErrors.email && (
                                    <p className="text-start mt-1 text-sm text-red-500">{formErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 text-start"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setFormErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    className={`appearance-none block w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {formErrors.password && (
                                    <p className="text-start mt-1 text-sm text-red-500">{formErrors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login