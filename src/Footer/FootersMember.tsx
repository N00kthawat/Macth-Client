import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { HiOutlineBuildingOffice, HiOutlineCreditCard, HiOutlineUserCircle, } from 'react-icons/hi2';

interface UserData {
  id: number;
  name: string;
  fullname?: string;
  email?: string;
  img?: string;
}

interface FooterProps {
  className?: string;
  isFixed?: boolean;
}

interface DecodedToken {
  id: string;
  exp: number;
}

const FootersMember: React.FC<FooterProps> = ({ className = '', isFixed = false }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/explore');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('token');
        navigate('/explore');
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

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${className} ${isFixed ? 'fixed bottom-0 left-0 w-full z-50' : 'mt-10'} bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm px-4 py-6`}
    >
      <div className="w-full flex flex-col items-center space-y-4">
        <div className="grid grid-cols-3 gap-8 text-center text-sm text-gray-600">
          <div className={`flex flex-col items-center transition cursor-pointer ${location.pathname === '/explore-member' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600' }`} onClick={() => navigate('/explore-member')} >
            <HiOutlineBuildingOffice className="w-6 h-6 mb-2" />
            <span>Explore Hotels</span>
          </div>

          <div className={`flex flex-col items-center transition cursor-pointer ${location.pathname === '/my-bookings' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600' }`} onClick={() => navigate('/my-bookings')} >
            <HiOutlineCreditCard className="w-6 h-6 mb-2" />
            <span>Book Your Stay</span>
          </div>
          <div className={`flex flex-col items-center transition cursor-pointer ${location.pathname === '/profile/edit' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600' }`} onClick={() => navigate('/profile/edit')} >
            <HiOutlineUserCircle className="w-6 h-6 mb-2" />
            <span>Your Profile</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">© 2025 <span className="font-medium text-blue-600">Macth</span>. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default FootersMember;