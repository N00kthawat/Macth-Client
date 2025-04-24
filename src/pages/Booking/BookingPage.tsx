import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import HeaderMember from '../../Header/HeaderMember';
import FootersMember from '../../Footer/FootersMember';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
      const API_URL = import.meta.env.VITE_APP_API_URL;

  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [idUser, setIdUser] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomInfo, setRoomInfo] = useState<{ room_type: string; price: number } | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ id: number }>(token);
        setIdUser(decoded.id);
      } catch (err) {
        toast.error('ไม่สามารถอ่าน token ได้');
      }
    }
  }, []);

  useEffect(() => {
    if (roomId) {
        axios.get(`${API_URL}/rooms/${roomId}`)
        .then(res => setRoomInfo(res.data))
        .catch(() => toast.error('ไม่สามารถโหลดข้อมูลห้องพัก'));
    }
  }, [roomId]);

  useEffect(() => {
    if (roomInfo && form.checkIn && form.checkOut) {
      const nights = (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24);
      if (nights > 0) {
        setTotalPrice(roomInfo.price * form.guests * nights);
      } else {
        setTotalPrice(0);
      }
    }
  }, [roomInfo, form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { checkIn, checkOut, guests } = form;

    if (!idUser || !roomId) {
      toast.error('ไม่พบข้อมูลผู้ใช้หรือห้องพัก');
      setIsSubmitting(false);
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.warning('วันที่เช็คอินต้องมาก่อนเช็คเอาท์');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/bookings`, {
        id_user: idUser,
        id_room: Number(roomId),
        quantity: guests,
        start_date: checkIn,
        end_date: checkOut,
      });

      toast.success('✅ จองสำเร็จแล้ว!');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'เกิดข้อผิดพลาดในการจอง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderMember className="fixed-header" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-20">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl px-6 py-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">แบบฟอร์มจองห้องพัก</h2>

          {roomInfo && (
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700">ชื่อห้อง: <span className="font-semibold text-blue-700">{roomInfo.room_type}</span></p>
              <p className="text-sm text-gray-600">ราคาต่อคืน: {roomInfo.price.toLocaleString()} บาท</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">วันที่เช็คอิน</Label>
                <TextInput name="checkIn" type="date" required min={today} value={form.checkIn} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="checkOut">วันที่เช็คเอาท์</Label>
                <TextInput name="checkOut" type="date" required min={form.checkIn || today} value={form.checkOut} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="guests">จำนวนห้องที่ต้องการจอง</Label>
              <TextInput name="guests" type="number" min={1} required value={form.guests} onChange={handleChange} />
            </div>

            {totalPrice > 0 && (
              <div className="text-center text-sm text-green-700 font-semibold">
                ราคารวม: {totalPrice.toLocaleString()} บาท
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 rounded-xl mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : 'ยืนยันการจอง'}
            </Button>
          </form>
        </div>
      </div>
      <FootersMember className="fixed-footer" />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default BookingPage;