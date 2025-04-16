import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiLogOut, FiUser } from 'react-icons/fi';
import { FaHome, FaBox, FaChartLine, FaUsers, FaCog } from 'react-icons/fa';
import { handleErrors, showToaster } from '../utils/common';
import { authService } from '../services/auth';

const Layout = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const navigationItems = [
        { title: 'Dashboard', icon: <FaHome />, path: '#' },
        { title: 'Products', icon: <FaBox />, path: '/manageproducts' },
        { title: 'Analytics', icon: <FaChartLine />, path: '#' },
        { title: 'Customers', icon: <FaUsers />, path: '#' },
        { title: 'Settings', icon: <FaCog />, path: '#' },
    ];

    const handleLogout = async () => {
        try {
            const data = await authService.logout()
            if (data.status) {
                showToaster(data.status, data.message)
                window.location = '/login'
            }
        } catch (error) {
            handleErrors(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <aside className={`bg-white shadow-lg fixed top-0 left-0 h-full z-50 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
                <div className="p-4">
                    <div className="flex items-center justify-center">
                        {isExpanded ? (
                            <h1 className="text-2xl font-bold text-indigo-600">Jewelry Admin</h1>
                        ) : (
                            <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
                        )}
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {navigationItems.map((item) => (
                            <li key={item.title}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 ${item.path !== '#' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                                        } rounded-lg transition-colors group`}
                                >
                                    <span className={`text-xl text-gray-600 ${item.path !== '#' ? 'bg-indigo-100 text-indigo-600' : ''} group-hover:text-indigo-600`}>{item.icon}</span>
                                    <span className={`ml-3 ${isExpanded ? 'block' : 'hidden'}`}>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md hover:bg-gray-50"
                >
                    {isExpanded ? <FiChevronLeft className="text-gray-600" /> : <FiChevronRight className="text-gray-600" />}
                </button>
            </aside>

            <div className={`pt-16 transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
                <nav className="fixed top-0 right-0 left-0 bg-white shadow-sm z-40">
                    <div className="flex justify-end items-center h-16 px-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-lg"
                            >
                                <FiUser className="text-gray-600 text-xl" />
                                <span className="text-gray-700">Admin</span>
                            </button>

                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
                                    <button
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            handleLogout()
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        <FiLogOut className="mr-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default Layout;