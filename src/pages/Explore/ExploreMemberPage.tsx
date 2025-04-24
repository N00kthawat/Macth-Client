import React, { useEffect, useState } from 'react';
import HeaderMember from '../../Header/HeaderMember';
import FootersMember from '../../Footer/FootersMember';
import '../../Header_Footer_CSS/Headder_Footer.css';
import axios from 'axios';
import { Modal, Select, Spinner } from 'flowbite-react';
import { RefreshCw, Building2, BedDouble, MountainSnow, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Hotel {
  id: number;
  name_hotel: string;
  name_type_hotel: string;
  address: string;
  detail: string;
  img: string;
  created_at: string;
  owner_id: number;
}

interface Room {
  id: number;
  room_type: string;
  view_type: string;
  price: number;
  number_of_guests: number;
  people: number;
  size_room: string;
  start_date_thai: string;
  end_date_thai: string;
  amenities: string[];
  bathrooms: string[];
  other_services: string[];
  images: string[];
  start_date: string;
  end_date: string;
}

const ExploreMemberPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ hotelTypes: [], roomTypes: [], viewTypes: [] });
  const [filters, setFilters] = useState({
    roomType: '',
    viewType: '',
    hotelType: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 6;
  const paginatedHotels = hotels.slice(
    (currentPage - 1) * hotelsPerPage,
    currentPage * hotelsPerPage
  );
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotels/filter-options`);
        setFilterOptions(res.data);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    const fetchFilteredHotels = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (filters.hotelType) query.append('hotelType', filters.hotelType);
        if (filters.roomType) query.append('roomType', filters.roomType);
        if (filters.viewType) query.append('viewType', filters.viewType);
        if (filters.startDate) query.append('startDate', filters.startDate);
        if (filters.endDate) query.append('endDate', filters.endDate);

        const res = await axios.get(`${API_URL}/hotels/filter?${query.toString()}`);
        setHotels(res.data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredHotels();
  }, [filters]);

  const handleOpen = async (hotel: Hotel) => {
    try {
      const hotelDetailRes = await axios.get(`${API_URL}/hotels/with-owner/${hotel.id}`);
      setSelectedHotel(hotelDetailRes.data);

      const roomsRes = await axios.get(`${API_URL}/hotels/${hotel.id}/rooms`);
      setRooms(roomsRes.data);

      setOpenModal(true);
    } catch (error) {
      console.error('Error loading hotel or rooms:', error);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedHotel(null);
    setRooms([]);
  };

  const handleResetFilters = () => {
    setFilters({ roomType: '', viewType: '', hotelType: '', startDate: '', endDate: '' });
  };

  const filteredRooms = rooms.filter(room => {
    return (
      (filters.roomType ? room.room_type === filters.roomType : true) &&
      (filters.viewType ? room.view_type === filters.viewType : true) &&
      (filters.hotelType ? selectedHotel?.name_type_hotel === filters.hotelType : true) &&
      (filters.startDate ? new Date(room.start_date) >= new Date(filters.startDate) : true) &&
      (filters.endDate ? new Date(room.end_date) <= new Date(filters.endDate) : true)
    );
  });

  return (
    <>
      <HeaderMember className="fixed-header" />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-[88px] pb-[200px] md:pb-[160px] px-4 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 leading-snug tracking-tight">
            <span>Hotels That</span>
            <span className="block bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-extrabold animate-fade-in">
              Macth Your Style
            </span>
          </h1>
          <div className="mt-2 mx-auto w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <p className="mt-2 text-gray-500 max-w-md mx-auto text-xs">
            Discover refined stays tailored to your comfort and character.
          </p>
        </div>

        <div className="mb-6 max-w-6xl mx-auto px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            {[{
              label: 'ประเภทโรงแรม', icon: <Building2 size={14} />, value: filters.hotelType,
              onChange: (v: string) => setFilters({ ...filters, hotelType: v }), options: filterOptions.hotelTypes
            }, {
              label: 'ประเภทห้อง', icon: <BedDouble size={14} />, value: filters.roomType,
              onChange: (v: string) => setFilters({ ...filters, roomType: v }), options: filterOptions.roomTypes
            }, {
              label: 'วิวห้อง', icon: <MountainSnow size={14} />, value: filters.viewType,
              onChange: (v: string) => setFilters({ ...filters, viewType: v }), options: filterOptions.viewTypes
            }].map(({ label, icon, value, onChange, options }, idx) => (
              <div className="flex flex-col space-y-1" key={idx}>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">{icon} {label}</label>
                <Select
                  className="h-[42px] rounded-md px-3 py-2 text-sm"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </div>
            ))}

            {[{
              label: 'วันที่เริ่มต้น', value: filters.startDate,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, startDate: e.target.value })
            }, {
              label: 'วันที่สิ้นสุด', value: filters.endDate,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, endDate: e.target.value }),
              min: filters.startDate
            }].map(({ label, value, onChange, min }, idx) => (
              <div className="flex flex-col space-y-1" key={idx}>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <CalendarDays size={14} /> {label}
                </label>
                <input
                  type="date"
                  value={value}
                  min={min}
                  onChange={onChange}
                  className="h-[42px] rounded-md px-3 text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}

            <div className="flex flex-col justify-end">
              <label className="sr-only">รีเซ็ต</label>
              <button
                onClick={handleResetFilters}
                className="h-[42px] text-white text-sm font-medium rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2 hover:scale-[1.03] hover:shadow-md"
              >
                <RefreshCw size={16} /> รีเซ็ต
              </button>
            </div>
          </div>

          <p className="text-gray-600 mt-5 mb-3 text-center md:text-left text-xs">
            แสดงผลทั้งหมด: <span className="font-semibold text-gray-800">{hotels.length}</span> แห่ง
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[180px]">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {paginatedHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => handleOpen(hotel)}
                className="rounded-xl overflow-hidden border border-gray-200 shadow hover:shadow-md transition bg-white cursor-pointer"
              >
                <img
                  src={`${API_URL.replace('/api', '')}/uploads/${hotel.img}`}
                  alt={hotel.name_hotel}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 space-y-1 text-[10px]">
                  <h2 className="font-bold text-gray-800 truncate">{hotel.name_hotel}</h2>
                  <p className="text-gray-500">{hotel.name_type_hotel}</p>
                  <p className="text-gray-600 line-clamp-2">{hotel.detail}</p>
                  <p className="text-[9px] text-gray-400">📍 {hotel.address}</p>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-gray-400">
                      {new Date(hotel.created_at).toLocaleDateString('th-TH')}
                    </span>
                    <button className="text-blue-600 text-[10px] hover:underline">ดูรายละเอียด</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-6 space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </div>

      <Modal show={openModal} onClose={handleClose} size="5xl" className="!z-[100]">
        <div className="fixed inset-0 z-[101] bg-white/30 backdrop-blur-md flex items-center justify-center px-4 py-6">
          <div className="bg-white w-full max-w-3xl max-h-full rounded-2xl shadow-xl overflow-hidden flex flex-col">

            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-4 md:px-6 pt-4 pb-2 border-b border-gray-200 flex justify-between items-start">
              {selectedHotel && (
                <>
                  <h2 className="text-base md:text-lg font-semibold text-gray-800">
                    {selectedHotel.name_hotel}
                    {selectedHotel.owner_id === currentUserId && (
                      <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        โรงแรมของคุณเอง
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-xs md:text-sm text-blue-600 hover:text-indigo-500 transition"
                  >
                    ✕ ปิด
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-3 pb-6 text-xs md:text-sm">
              {selectedHotel && (
                <>
                  <p className="text-[10px] text-gray-400 mb-2">
                    สร้างเมื่อ: {new Date(selectedHotel.created_at).toLocaleDateString('th-TH')}
                  </p>

                  <hr className="my-2 border-gray-200" />

                  <h3 className="font-semibold text-gray-700 text-sm mb-4">
                    มีห้องทั้งหมด {filteredRooms.length} ห้อง
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        className="relative border border-gray-200 p-3 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                      >
                        {selectedHotel.owner_id === currentUserId && (
                          <div className="absolute top-2 left-2 bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                            ห้องในโรงแรมของคุณ
                          </div>
                        )}

                        {room.images.length > 0 && (
                          <img
                            src={`${API_URL.replace('/api', '')}/uploads/${room.images[0]}`}
                            alt={`Room ${room.room_type}`}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                        )}

                        <h4 className="font-bold text-gray-800 mb-1">{room.room_type}</h4>
                        <p className="text-gray-600">วิว: {room.view_type}</p>
                        <p className="text-blue-600 font-medium">
                          ราคา: {room.price.toLocaleString()} บาท / คืน
                        </p>
                        <p className="text-gray-600">รองรับ: {room.people} คน</p>
                        <p className="text-gray-600">ขนาดห้อง: {room.size_room || '-'}</p>
                        <p className="text-gray-600">จำนวนคงเหลือ: {room.number_of_guests} ห้อง</p>
                        <p className="text-gray-500 text-[10px]">
                          ช่วงจอง: {room.start_date_thai} - {room.end_date_thai}
                        </p>

                        {/* Booking button or block message */}
                        {selectedHotel.owner_id === currentUserId ? (
                          <div className="mt-3 text-right">
                            <p className="text-gray-500 text-xs italic">
                              * ไม่สามารถจองโรงแรมที่คุณเป็นเจ้าของได้
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 text-right">
                            <button
                              onClick={() => navigate(`/booking/${room.id}`)}
                              className="text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1.5 rounded-md hover:opacity-90 transition"
                            >
                              จองห้องพัก
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <FootersMember className="fixed-footer mt-10" />
    </>
  );
};

export default ExploreMemberPage;