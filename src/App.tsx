import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';

import AddHotelPage from './Managements/Hotels/AddHotel/AddHotelPage';
import AddHotelImagePage from './Managements/Hotels/AddHotel/AddHotelImagePage';
import AllHotel from './Managements/Hotels/AllHotel/AllHotel';
import HotelDetailPage from './Managements/Hotels/HotelDetail/HotelDetailPage';
import AddRoomPage from './Managements/Hotels/AddRoom/AddRoomPage';
import EditRoomPage from './Managements/Hotels/EditRoom/EditRoomPage';

import ExplorePage from './pages/Explore/ExplorePage';
import ExploreMemberPage from './pages/Explore/ExploreMemberPage';

import BookingPage from './pages/Booking/BookingPage';
import MyBookingsPage from './pages/Booking/MyBookingsPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import EditProfilePage from './pages/Profile/EditProfilePage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />

        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/explore-member" element={<ExploreMemberPage />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        <Route path="/add-hotel" element={<AddHotelPage />} />
        <Route path="/add-hotel/upload" element={<AddHotelImagePage />} />
        <Route path="/allhotel" element={<AllHotel />} />
        <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
        <Route path="/add-room/:hotelId" element={<AddRoomPage />} />
        <Route path="/edit-room/:roomId" element={<EditRoomPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;