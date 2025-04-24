import React, { useState, useEffect } from 'react';
import { Button, FileInput, Label, HelperText } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../Header/HeaderMember';
import Swal from 'sweetalert2';
import Footer from '../../../Footer/FootersMember';
import '../../../Header_Footer_CSS/Headder_Footer.css';

interface LocationState {
    name: string;
    address: string;
    detail: string;
    id_type_hotel: string;
    id_user: number;
    id_hotel: number;
}

const AddHotelImagePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const state = location.state as LocationState;

    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!state) {
            navigate('/add-hotel');
        }
    }, [state, navigate]);

    useEffect(() => {
        if (files.length === 0) {
            setPreviews([]);
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setError('');
        }
    };

    const handleRemoveImage = (index: number) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
      
        files.forEach((file) => {
          formData.append('images', file);
        });
      
        formData.append('id_hotel', state.id_hotel?.toString() ?? '');
      
        try {
          const uploadRes = await axios.post(`${API_URL}/hotels/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      
          console.log('อัปโหลดสำเร็จ:', uploadRes.data);
      
          Swal.fire({
            icon: 'success',
            title: 'อัปโหลดสำเร็จ!',
            text: 'ระบบจะนำคุณไปยังหน้าโรงแรมของฉัน',
            timer: 2000,
            showConfirmButton: false,
          });
      
          setTimeout(() => {
            navigate('/allhotel');
          }, 2000);
      
        } catch (err) {
          console.error('เกิดข้อผิดพลาด:', err);
          Swal.fire({
            title: 'อัปโหลดสำเร็จ!',
            text: 'ระบบจะนำคุณไปยังหน้าโรงแรมของฉัน',
            timer: 2000,
            showConfirmButton: false,
            background: '#ffffff',
            customClass: {
              popup: 'rounded-2xl shadow-lg px-6 py-6',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-sm text-gray-500',
            },
            didOpen: () => {
              const iconContainer = Swal.getPopup()?.querySelector('.custom-icon');
              if (iconContainer) {
                iconContainer.innerHTML = `
                  <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-2xl">
                    ✓
                  </div>
                `;
              }
            },
            html: `
              <div class="flex flex-col items-center space-y-2">
                <div class="custom-icon"></div>
                <div class="text-sm text-gray-500">ระบบจะนำคุณไปยังหน้าโรงแรมของฉัน</div>
              </div>
            `,
          });
        }
      };

    return (
        <>
            <Header className="fixed-header" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[88px] pb-24 px-4">
                <div className="max-w-md mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl px-6 py-8 space-y-6">

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">อัปโหลดรูปโรงแรม</h2>
                        <p className="text-sm text-gray-400 tracking-wide mt-1">Upload hotel image(s)</p>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-sm font-medium text-gray-700">เลือกรูปภาพ</Label>
                        <FileInput
                            id="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="w-full"
                        />
                        <HelperText className="text-xs text-gray-500">รองรับเฉพาะ .jpg, .png ขนาดไม่เกิน 5MB</HelperText>
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto max-h-[300px]">
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-36 object-cover rounded-xl border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 transition"
                                        title="ลบรูป"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-medium py-2 text-sm"
                    >
                        บันทึกข้อมูลโรงแรม
                    </Button>
                </div>
            </div>
            <Footer className="fixed-footer" />
        </>
    );
};

export default AddHotelImagePage;