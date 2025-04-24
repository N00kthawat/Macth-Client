import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Label, Spinner, Card } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../../../Header/HeaderMember';
import Footer from '../../../Footer/FootersMember';

interface Hotel {
    id: number;
    name_hotel: string;
    name_type_hotel: string;
    address: string;
    detail: string;
    img: string;
}

const AllHotel: React.FC = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/explore');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                localStorage.removeItem('token');
                navigate('/explore');
                return;
            }

            setUserId(decoded.id);
        } catch (error) {
            console.error('Token decode error:', error);
            localStorage.removeItem('token');
            navigate('/explore');
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchHotels = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/hotels/user/${userId}?sort=${sortOrder}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setHotels(response.data);
            } catch (error) {
                console.error('❌ โหลดข้อมูลล้มเหลว:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [sortOrder, userId]);

    return (
        <>
            <Header className="fixed-header" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[88px] pb-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="sticky top-[88px] z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800">โรงแรมของฉัน</h2>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="sortOrder" className="text-sm text-gray-600">เรียงลำดับ:</Label>
                            <Select
                                id="sortOrder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                                className="w-36 sm:w-40 rounded-md text-sm border-gray-300 focus:ring-blue-500 focus:border-indigo-500 shadow-sm"
                            >
                                <option value="latest">ล่าสุด</option>
                                <option value="oldest">เก่าสุด</option>
                            </Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <Spinner size="lg" />
                        </div>
                    ) : hotels.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">ไม่พบโรงแรมที่คุณสร้างไว้</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {hotels.map((hotel) => (
                                <Link to={`/hotel/${hotel.id}`} key={hotel.id} className="hover:scale-[1.01] transition-transform">
                                    <Card className="w-full border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                        <img
                                            src={`${API_URL.replace('/api', '')}/uploads/${hotel.img}`}
                                            alt={hotel.name_hotel}
                                            className="h-40 w-full object-cover rounded-t-xl"
                                        />
                                        <div className="p-3 space-y-1 text-sm">
                                            <h5 className="font-semibold text-gray-900 line-clamp-2">{hotel.name_hotel}</h5>
                                            <p className="text-gray-600 text-xs line-clamp-3">{hotel.address}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer className="fixed-footer" />
        </>
    );
};

export default AllHotel;