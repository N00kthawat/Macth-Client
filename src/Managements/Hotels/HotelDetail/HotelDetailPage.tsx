import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Carousel, Button, Modal } from 'flowbite-react';
import Header from '../../../Header/HeaderMember';
import Footer from '../../../Footer/FootersMember';

interface Room {
  id: number;
  room_type: string;
  view_type: string;
  price: number;
  number_of_guests: number;
  people: number;
  size_room: string;
  start_date: string;
  end_date: string;
  start_date_thai: string;
  end_date_thai: string;
  amenities: string[];
  bathrooms: string[];
  other_services: string[];
  images: string[];
}

interface HotelInfo {
  name: string;
  type: string;
  address: string;
  detail: string;
  images: string[];
}

const HotelDetailPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const [hotelRes, roomRes] = await Promise.all([
          axios.get(`${API_URL}/hotels/${hotelId}/info`),
          axios.get(`${API_URL}/hotels/${hotelId}/rooms`),
        ]);
        setHotelInfo(hotelRes.data);
        setRooms(roomRes.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching hotel or rooms:', error);
        setError('ไม่สามารถโหลดข้อมูลโรงแรมหรือห้องพักได้ กรุณาลองใหม่');
      }
    };

    fetchHotelAndRooms();
  }, [hotelId, API_URL]);

  const openRoomDetail = (room: Room) => {
    setSelectedRoom(room);
    setOpenModal(true);
  };

  const closeRoomDetail = () => {
    setSelectedRoom(null);
    setOpenModal(false);
  };

  return (
    <>
      <Header className="fixed-header" />
      <div className="container mx-auto px-4 mt-28 mb-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">จัดการข้อมูลโรงแรม</h2>
            <p className="text-sm text-gray-500">ดูรายละเอียดและจัดการห้องพักของโรงแรมคุณ</p>
          </div>
          <Button
            onClick={() => navigate(`/add-room/${hotelId}`)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            เพิ่มห้อง
          </Button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {hotelInfo && hotelInfo.images && hotelInfo.images.length > 0 && (
          <div className="rounded-xl overflow-hidden shadow mb-6 max-w-5xl mx-auto">
            <Carousel className="aspect-video w-full" slide indicators pauseOnHover>
              {hotelInfo.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_URL.replace('/api', '')}/uploads/${img}`}
                  alt={`Hotel ${hotelId} - ${idx}`}
                  className="object-cover w-full h-full"
                />
              ))}
            </Carousel>
          </div>
        )}

        <div className="mb-10 text-center max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800">{hotelInfo?.name || 'รายละเอียดโรงแรม'}</h2>
          <p className="text-gray-500 text-sm mt-1">{hotelInfo?.address}</p>
          {hotelInfo?.type && <p className="text-sm text-blue-500 mt-1">ประเภท: {hotelInfo.type}</p>}
          {hotelInfo?.detail && <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-4">{hotelInfo.detail}</p>}
          <p className="text-sm text-gray-700 mt-2">มีทั้งหมด <span className="font-semibold text-blue-600">{rooms.length}</span> ห้อง</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-blue-800">{room.room_type}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">วิว:</span> {room.view_type}</p>
                  <p><span className="font-medium">ขนาด:</span> {room.size_room || '-'}</p>
                  <p><span className="font-medium text-green-700">ราคา:</span> {room.price.toLocaleString()} บาท/คืน</p>
                  <p><span className="font-medium">ผู้เข้าพัก:</span> {room.people} คน</p>
                  <p><span className="font-medium">จำนวนห้อง:</span> {room.number_of_guests} ห้อง</p>
                </div>
                <Button size="sm" className="w-full mt-3" onClick={() => openRoomDetail(room)} color="blue">
                  ดูรายละเอียดห้อง
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal show={openModal} onClose={closeRoomDetail} size="5xl">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[90vh] rounded-lg bg-white shadow-xl mt-[-50px]">
          {selectedRoom && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="w-full lg:w-[45%]">
                <Carousel className="h-64 rounded-lg shadow-md">
                  {selectedRoom.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${API_URL.replace('/api', '')}/uploads/${img}`}
                      className="object-cover w-full h-full rounded-lg"
                      alt={`Room image ${idx}`}
                    />
                  ))}
                </Carousel>
              </div>

              <div className="w-full lg:w-[55%] space-y-3 text-sm text-gray-700">
                <h3 className="text-2xl font-bold text-gray-800">{selectedRoom.room_type}</h3>
                <p className="text-gray-600">วิว: <span className="font-medium">{selectedRoom.view_type}</span></p>
                <p>ขนาดห้อง: {selectedRoom.size_room} ตร.ม.</p>
                <p>ราคา: <span className="text-lg font-semibold text-blue-600">{selectedRoom.price.toLocaleString()} บาท / คืน</span></p>
                <p>รองรับผู้เข้าพัก: {selectedRoom.people} คน</p>
                <p>จำนวนห้อง: {selectedRoom.number_of_guests} ห้อง</p>
                <p>ช่วงเวลาเปิดให้จอง: {selectedRoom.start_date_thai} - {selectedRoom.end_date_thai}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">สิ่งอำนวยความสะดวก</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedRoom.amenities.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">ห้องน้ำ</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedRoom.bathrooms.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-1">บริการเพิ่มเติม</h4>
                    <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-x-4">
                      {selectedRoom.other_services.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Button
                    onClick={closeRoomDetail}
                    className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    ปิด
                  </Button>
                  <Button
                    onClick={() => navigate(`/edit-room/${selectedRoom.id}`)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                  >
                    แก้ไขข้อมูลห้อง
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Footer className="fixed-footer" />
    </>
  );
};

export default HotelDetailPage;