import React, { useState, useEffect } from 'react';
import {  Label, TextInput, Textarea, Button, Select } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../../../Header/HeaderMember';
import Footer from '../../../Footer/FootersMember';
import '../../../Header_Footer_CSS/Headder_Footer.css';

interface HotelType {
    id: number;
    name: string;
}

const AddHotelPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();
    const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        address: '',
        detail: '',
        id_type_hotel: '',
    });
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

            axios
                .get(`${API_URL}/hotels/types`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setHotelTypes(res.data))
                .catch((err) => {
                    console.error('Error loading hotel types', err);
                    alert('โหลดข้อมูลประเภทโรงแรมล้มเหลว');
                });
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            navigate('/explore');
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNext = async () => {
        if (!form.name || !form.address || !form.id_type_hotel) {
            alert('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        try {
            setLoading(true);
            const hotelData = {
                ...form,
                id_user: userId,
            };
            const res = await axios.post(`${API_URL}/hotels`, hotelData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            const id_hotel = res.data.id;

            navigate('/add-hotel/upload', {
                state: {
                    ...form,
                    id_user: userId,
                    id_hotel,
                },
            });
        } catch (err) {
            console.error('Error creating hotel:', err);
            alert('เกิดข้อผิดพลาดในการสร้างโรงแรม');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header className="fixed-header" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[88px] pb-24 px-4">
                <div className="max-w-md mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl px-6 py-8 space-y-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Fill in hotel</h2>
                        <p className="text-sm text-gray-400 tracking-wide mt-1">i n f o r m a t i o n</p>
                    </div>

                    <form className="space-y-5 text-sm">
                        <div>
                            <Label htmlFor="name">ชื่อโรงแรม</Label>
                            <TextInput
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="id_type_hotel">ประเภทโรงแรม</Label>
                            <Select
                                id="id_type_hotel"
                                name="id_type_hotel"
                                value={form.id_type_hotel}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            >
                                <option value="">เลือกประเภท</option>
                                {hotelTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="address">ที่อยู่</Label>
                            <Textarea
                                id="address"
                                name="address"
                                rows={3}
                                value={form.address}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="detail">รายละเอียดเพิ่มเติม</Label>
                            <Textarea
                                id="detail"
                                name="detail"
                                rows={4}
                                value={form.detail}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <Button
                            onClick={handleNext}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-medium py-2 text-sm"
                        >
                            ถัดไป
                        </Button>
                    </form>
                </div>
            </div>
            <Footer className="fixed-footer" />
        </>
    );
};

export default AddHotelPage;