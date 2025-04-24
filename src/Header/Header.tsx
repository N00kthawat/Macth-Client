// src/pages/Header.tsx
import React from 'react';
import { Button, Navbar, NavbarBrand, Banner, BannerCollapseButton } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar fluid rounded className={className}>
                <NavbarBrand href="https://flowbite-react.com">
                    <span className="text-xl font-semibold dark:text-white">
                        Macth
                    </span>
                </NavbarBrand>
                <div className="flex md:order-2">
                    <button onClick={() => navigate('/login')} className="h-[42px] px-5 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition" >
                        เข้าสู่ระบบ
                    </button>
                </div>
            </Navbar>

            <Banner style={{ marginTop: '90px', justifyItems: 'center' }} className={className}>
                <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl bg-white border border-gray-100 shadow-sm rounded-lg p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="flex flex-col md:flex-row items-center">
                        <a href="" className="flex items-center md:border-r md:border-gray-200 md:pr-4 dark:border-gray-600">
                            <span className="text-lg font-semibold dark:text-white">
                                Macth
                            </span>
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400 md:ml-4">
                            จองโรงแรมวันนี้ รับส่วนลดสูงสุด 50% พร้อมยกเลิกฟรี!
                        </p>
                    </div>
                    <div className="flex items-center mt-3 md:mt-0">
                        <Button href="/register" style={{ marginLeft: '20px' }}
                            className="h-[42px] px-5 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition">
                            สมัครสมาชิก
                        </Button>
                        <BannerCollapseButton color="gray" className="bg-transparent border-0 text-gray-500 dark:text-gray-400" >
                            <HiX className="h-4 w-4" />
                        </BannerCollapseButton>
                    </div>
                </div>
            </Banner>

        </>
    );
};

export default Header;