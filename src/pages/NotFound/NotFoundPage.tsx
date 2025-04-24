import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to="/explore" className="text-blue-600 hover:underline">
        กลับหน้าหลัก
      </Link>
    </div>
  );
};

export default NotFoundPage;