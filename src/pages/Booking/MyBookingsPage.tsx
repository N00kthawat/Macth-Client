import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { Card, Button, Spinner } from 'flowbite-react';
import { CalendarDaysIcon, UsersIcon } from 'lucide-react';
import HeaderMember from '../../Header/HeaderMember';
import FootersMember from '../../Footer/FootersMember';

const API_URL = import.meta.env.VITE_APP_API_URL;

interface Booking {
    id: number;
    start_date: string;
    end_date: string;
    quantity: number;
    created_at: string;
    room_type: string;
    view_type: string;
    hotel_name: string;
    image: string | null;
}

const MyBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async (userId: number) => {
        try {
            const res = await axios.get(`${API_URL}/bookings/user/${userId}`);
            setBookings(res.data);
        } catch {
            toast.error('ไม่สามารถโหลดข้อมูลการจอง');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        if (!window.confirm('คุณแน่ใจว่าต้องการยกเลิกการจองนี้หรือไม่?')) return;
        try {
            await axios.delete(`${API_URL}/bookings/${id}`);
            toast.success('ยกเลิกการจองสำเร็จ!');
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch {
            toast.error('เกิดข้อผิดพลาดในการยกเลิก');
        }
    };

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('กรุณาเข้าสู่ระบบ');
                setLoading(false);
                return;
            }
            try {
                const decoded = jwtDecode<{ id: number }>(token);
                await fetchBookings(decoded.id);
            } catch {
                toast.error('Token ไม่ถูกต้อง');
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <HeaderMember />
            <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 pt-[100px]">
                <div className="max-w-md mx-auto">
                    <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
                        การจองของฉัน
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Spinner size="md" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm">ยังไม่มีรายการจอง</p>
                    ) : (
                        <div className="space-y-2">
                            {bookings.map(b => (
                                <Card
                                    key={b.id}
                                    className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-md p-2 space-x-2"
                                >
                                    <img
                                        src={b.image
                                            ? `${API_URL.replace('/api', '')}/uploads/${b.image}`
                                            : '/no-image.png'}
                                        alt="ห้องพัก"
                                        className="w-16 h-16 object-cover rounded-md"
                                        onError={(e: any) => (e.currentTarget.src = '/no-image.png')}
                                    />
                                    <div className="flex-1 text-xs">
                                        <p className="font-medium text-gray-800 truncate">{b.hotel_name}</p>
                                        <p className="text-gray-700 truncate">🛏 {b.room_type} ({b.view_type})</p>
                                        <div className="flex items-center text-gray-600">
                                            <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                            <span>{dayjs(b.start_date).format('DD/MM/YYYY')} – {dayjs(b.end_date).format('DD/MM/YYYY')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UsersIcon className="w-4 h-4 mr-1" />
                                            <span>จำนวน {b.quantity} ห้อง</span>
                                        </div>
                                    </div>
                                    <Button
                                        size="xs"
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-3 py-1 rounded-md shadow-sm transition"
                                        onClick={() => handleCancel(b.id)} >
                                        ยกเลิก
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FootersMember className="fixed-footer mt-10" />
        </>
    );
};

export default MyBookingsPage;
