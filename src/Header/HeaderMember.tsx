// src/pages/Header.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Badge, MegaMenuDropdown, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface UserData {
    id: number;
    name: string;
    fullname?: string;
    email?: string;
    img?: string;
}

interface HeaderProps {
    className?: string;
}

const HeaderMember: React.FC<HeaderProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/explore');
            return;
        }

        try {
            const decoded: { id: number; exp: number } = jwtDecode(token);

            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${decoded.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                    navigate('/explore');
                }
            };

            fetchUserData();
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            navigate('/explore');
        }
    }, [navigate, API_URL]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/explore');
    };

    return (
        <>
            <Navbar fluid rounded className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm ${className}`}>
                {userData && (
                    <>
                        <NavbarBrand style={{ marginLeft: '20px' }}>
                            <div className="w-10 h-10 sm:w-15 sm:h-15 overflow-hidden rounded-full mr-1">
                                <Avatar
                                    img={`${API_URL.replace('/api', '')}/uploads/${userData.img || 'default-image.png'}`}
                                    className="w-full h-full object-cover"
                                    rounded
                                    bordered
                                    status="online"
                                    statusPosition="top-right"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold dark:text-white">{userData.name}</span>
                                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{userData.fullname}</span>
                            </div>
                        </NavbarBrand>

                        <NavbarToggle className="text-blue-500 hover:text-indigo-500" />

                        <NavbarCollapse>
                            <MegaMenuDropdown
                                toggle={
                                    <Badge size="2xl" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                                        Management
                                    </Badge>
                                }
                            >
                                <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hotel</h3>
                                    <ul className="space-y-3">
                                        {[
                                            { href: '/add-hotel', label: 'Add a hotel' },
                                            { href: '/allhotel', label: 'Manage hotels' },
                                        ].map((item, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={item.href}
                                                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                                >
                                                    <span className="mr-2 text-blue-400">•</span>
                                                    {item.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </MegaMenuDropdown>

                            <NavbarLink style={{ marginTop: '0px', width: '160px' }} onClick={handleLogout}>
                                ออกจากระบบ
                            </NavbarLink>
                        </NavbarCollapse>
                    </>
                )}
            </Navbar>
        </>
    );
};

export default HeaderMember;