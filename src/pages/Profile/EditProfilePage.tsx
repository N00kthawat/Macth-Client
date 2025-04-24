// src/pages/Profile/EditProfilePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Label, FileInput, HelperText, } from 'flowbite-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import HeaderMember from '../../Header/HeaderMember';
import FootersMember from '../../Footer/FootersMember';

const API_URL = import.meta.env.VITE_APP_API_URL;

interface UserProfile {
    id: number;
    name: string;
    fullname: string;
    province: string;
    phone: string;
    facebook: string;
    id_line: string;
    email: string;
    img: string | null;
}

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [fullname, setFullname] = useState('');
    const [province, setProvince] = useState('');
    const [phone, setPhone] = useState('');
    const [facebook, setFacebook] = useState('');
    const [idLine, setIdLine] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string>('');

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('กรุณาเข้าสู่ระบบก่อน');
                navigate('/login');
                return;
            }
            try {
                const { id } = jwtDecode<{ id: number }>(token);
                const res = await axios.get<UserProfile>(`${API_URL}/users/${id}`);
                setProfile(res.data);
                setName(res.data.name);
                setFullname(res.data.fullname);
                setProvince(res.data.province);
                setPhone(res.data.phone);
                setFacebook(res.data.facebook);
                setIdLine(res.data.id_line);
                setEmail(res.data.email);
                if (res.data.img) {
                    setImgPreview(`${API_URL.replace('/api', '')}/uploads/${res.data.img}`);
                }
            } catch (err) {
                toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้');
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    useEffect(() => {
        if (img) {
            const url = URL.createObjectURL(img);
            setImgPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [img]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('fullname', fullname);
        formData.append('province', province);
        formData.append('phone', phone);
        formData.append('facebook', facebook);
        formData.append('id_line', idLine);
        formData.append('email', email);
        if (img) formData.append('img', img);

        try {
            await axios.put(
                `${API_URL}/users/${profile.id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            toast.success('อัปเดตโปรไฟล์สำเร็จ');
            setTimeout(() => navigate('/explore-member'), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'อัปเดตไม่สำเร็จ');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <HeaderMember />
            <div className="min-h-[calc(100vh-160px)] mt-[80px] mb-[80px] flex items-center justify-center bg-gray-50 px-4 py-10">
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl space-y-6"
                >
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        แก้ไขข้อมูลส่วนตัว
                    </h2>

                    <div className="flex justify-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                            {imgPreview ? (
                                <img
                                    src={imgPreview}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg
                                        className="w-8 h-8"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <Label htmlFor="img">เปลี่ยนรูปโปรไฟล์</Label>
                        <FileInput
                            id="img"
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files && setImg(e.target.files[0])
                            }
                        />
                        <HelperText>ขนาดไม่เกิน 2MB</HelperText>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="sm:col-span-2">
                            <Label htmlFor="fullname">ชื่อ-นามสกุล</Label>
                            <TextInput
                                id="fullname"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">ชื่อเล่น</Label>
                            <TextInput
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="province">จังหวัด</Label>
                            <TextInput
                                id="province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                            <TextInput
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="facebook">Facebook</Label>
                            <TextInput
                                id="facebook"
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="id_line">LINE ID</Label>
                            <TextInput
                                id="id_line"
                                value={idLine}
                                onChange={(e) => setIdLine(e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label htmlFor="email">อีเมล</Label>
                            <TextInput
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </div>
                </motion.form>
            </div>
            <FootersMember className="fixed-footer" />
        </>
    );
};

export default EditProfilePage;