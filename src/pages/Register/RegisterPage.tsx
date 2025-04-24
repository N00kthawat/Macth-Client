// src/pages/RegisterPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextInput, Label, FileInput, HelperText } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../../Footer/Footers';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [fullname, setFullname] = useState('');
  const [province, setProvince] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [idLine, setIdLine] = useState('');
  const [img, setImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    if (img) {
      const objectUrl = URL.createObjectURL(img);
      setImgPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImgPreview('');
    }
  }, [img]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('fullname', fullname);
    formData.append('province', province);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('facebook', facebook);
    formData.append('id_line', idLine);
    if (img) formData.append('img', img);

    try {
      await axios.post(`${API_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/lobby-blur.jpg')] bg-cover bg-center relative pt-10 pb-32">
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 bg-white/90 backdrop-blur-xl border border-white/10 shadow-2xl p-8 md:p-10 rounded-3xl w-full max-w-3xl text-gray-800 space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-blue-700">ลงทะเบียนบัญชี Macth</h1>
            <p className="text-sm text-gray-600 mt-2">เพื่อเริ่มต้นประสบการณ์การจองโรงแรมที่ “เข้ากับสไตล์คุณ”</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-[48px] h-[48px] text-gray-400 mx-auto mt-7" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          <div className="max-w-sm mx-auto">
            <Label htmlFor="img">รูปโปรไฟล์</Label>
            <FileInput
              id="img"
              accept="image/*"
              required
              onChange={(e) => e.target.files && setImg(e.target.files[0])}
            />
            <HelperText className="text-xs text-gray-500 mt-1">อัปโหลดรูปเพื่อใช้แสดงในโปรไฟล์ของคุณ</HelperText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 text-sm mt-6">
            <div className="md:col-span-2">
              <Label htmlFor="fullname">ชื่อ-นามสกุล</Label>
              <TextInput id="fullname" placeholder="ชื่อ-นามสกุล" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="name">ชื่อเล่น</Label>
              <TextInput id="name" placeholder="ชื่อเล่น" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="province">จังหวัด</Label>
              <TextInput id="province" placeholder="จังหวัด" value={province} onChange={(e) => setProvince(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <TextInput id="phone" placeholder="0123456789" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <TextInput id="facebook" placeholder="ชื่อ Facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="id_line">LINE ID</Label>
              <TextInput id="id_line" placeholder="LINE ID" value={idLine} onChange={(e) => setIdLine(e.target.value)} />
            </div>

            <div className="md:col-span-2 border-t pt-6">
              <Label htmlFor="email">อีเมล</Label>
              <TextInput id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <TextInput id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white rounded-lg transition shadow-md hover:shadow-lg"
          >
            ลงทะเบียน
          </Button>
        </motion.form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;