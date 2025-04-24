import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Label, TextInput, Checkbox, Select, FileInput, Card } from 'flowbite-react';
import Header from '../../../Header/HeaderMember';
import Footer from '../../../Footer/FootersMember';

interface OptionType {
    id: number;
    name: string;
}

const EditRoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_APP_API_URL;

    const [roomData, setRoomData] = useState({
        id_type_room: '',
        id_type_view: '',
        price: '',
        people: '',
        size_room: '',
        number_of_guessts: '',
        start_date: '',
        end_date: '',
        amenities: [] as string[],
        bathrooms: [] as string[],
        other_services: [] as string[],
        images: [] as string[]
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roomTypes, setRoomTypes] = useState<OptionType[]>([]);
    const [viewTypes, setViewTypes] = useState<OptionType[]>([]);
    const [amenities, setAmenities] = useState<OptionType[]>([]);
    const [bathrooms, setBathrooms] = useState<OptionType[]>([]);
    const [services, setServices] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomRes, typesRes, viewsRes, amenitiesRes, bathroomsRes, servicesRes] = await Promise.all([
                    axios.get(`${API_URL}/rooms/${roomId}`),
                    axios.get(`${API_URL}/room-meta/room-types`),
                    axios.get(`${API_URL}/room-meta/view-types`),
                    axios.get(`${API_URL}/room-meta/amenities`),
                    axios.get(`${API_URL}/room-meta/bathrooms`),
                    axios.get(`${API_URL}/room-meta/other-services`),
                ]);

                const room = roomRes.data;
                setRoomData({
                    id_type_room: room.id_type_room?.toString() || '',
                    id_type_view: room.id_type_view?.toString() || '',
                    price: room.price,
                    people: room.people,
                    size_room: room.size_room || '',
                    number_of_guessts: room.number_of_guessts || '',
                    start_date: room.start_date?.split('T')[0] || '',
                    end_date: room.end_date?.split('T')[0] || '',
                    amenities: room.amenities?.map((a: any) => a.toString()) || [],
                    bathrooms: room.bathrooms?.map((b: any) => b.toString()) || [],
                    other_services: room.other_services?.map((s: any) => s.toString()) || [],
                    images: room.images || []
                });

                setRoomTypes(typesRes.data);
                setViewTypes(viewsRes.data);
                setAmenities(amenitiesRes.data);
                setBathrooms(bathroomsRes.data);
                setServices(servicesRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, [roomId, API_URL]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoomData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, value: string) => {
        setRoomData((prev) => {
            const current = prev[name as keyof typeof roomData] as string[];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [name]: updated };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files);
    };

    const handleRemoveImage = (filename: string) => {
        setRoomData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== filename)
        }));
        setImagesToRemove((prev) => [...prev, filename]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(roomData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, value);
            }
        });

        if (images) {
            Array.from(images).forEach((file) => {
                formData.append('images', file);
            });
        }

        imagesToRemove.forEach((filename) => {
            formData.append('imagesToRemove[]', filename);
        });

        try {
            await axios.put(`${API_URL}/rooms/${roomId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate(-1);
        } catch (error) {
            console.error('Error updating room:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header className="fixed-header" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[88px] pb-24 px-4">
                <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl px-6 py-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">แก้ไขข้อมูลห้องพัก</h2>

                    <form onSubmit={handleSubmit} className="space-y-8 text-sm text-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="id_type_room" className="mb-1 block">ประเภทห้อง</Label>
                                <Select name="id_type_room" value={roomData.id_type_room} onChange={handleChange} required>
                                    <option value="">-- เลือก --</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="id_type_view" className="mb-1 block">วิว</Label>
                                <Select name="id_type_view" value={roomData.id_type_view} onChange={handleChange} required>
                                    <option value="">-- เลือก --</option>
                                    {viewTypes.map((view) => (
                                        <option key={view.id} value={view.id}>{view.name}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="price" className="mb-1 block">ราคา</Label>
                                <TextInput name="price" type="number" value={roomData.price} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="people" className="mb-1 block">จำนวนผู้เข้าพัก</Label>
                                <TextInput name="people" type="number" value={roomData.people} onChange={handleChange} required />
                            </div>

                            <div>
                                <Label htmlFor="size_room" className="mb-1 block">ขนาดห้อง</Label>
                                <TextInput name="size_room" value={roomData.size_room} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="number_of_guessts" className="mb-1 block">จำนวนห้อง</Label>
                                <TextInput name="number_of_guessts" value={roomData.number_of_guessts} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="start_date" className="mb-1 block">วันที่เริ่มต้น</Label>
                                <TextInput type="date" name="start_date" value={roomData.start_date} onChange={handleChange} />
                            </div>

                            <div>
                                <Label htmlFor="end_date" className="mb-1 block">วันที่สิ้นสุด</Label>
                                <TextInput type="date" name="end_date" value={roomData.end_date} onChange={handleChange} />
                            </div>
                        </div>

                        {roomData.images.length > 0 && (
                            <div>
                                <Label className="block mb-2">รูปภาพเดิม</Label>
                                <div className="flex gap-3 flex-wrap">
                                    {roomData.images.map((img, idx) => (
                                        <div className="relative inline-block" key={idx}>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img)}
                                                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
                                            >
                                                ×
                                            </button>
                                            <img
                                                src={`${API_URL.replace('/api', '')}/uploads/${img}`}
                                                alt={`room-old-${idx}`}
                                                className="w-32 h-20 object-cover rounded border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <Label className="block mb-2">อัปโหลดรูปภาพใหม่</Label>
                            <FileInput multiple onChange={handleImageChange} />
                        </div>

                        <div>
                            <Label className="block mb-2">สิ่งอำนวยความสะดวก</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amenities.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`amenity-${item.id}`}
                                            value={item.id.toString()}
                                            checked={roomData.amenities.includes(item.id.toString())}
                                            onChange={() => handleCheckboxChange('amenities', item.id.toString())}
                                        />
                                        <Label htmlFor={`amenity-${item.id}`}>{item.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="block mb-2">ห้องน้ำ</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {bathrooms.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`bathroom-${item.id}`}
                                            value={item.id.toString()}
                                            checked={roomData.bathrooms.includes(item.id.toString())}
                                            onChange={() => handleCheckboxChange('bathrooms', item.id.toString())}
                                        />
                                        <Label htmlFor={`bathroom-${item.id}`}>{item.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="block mb-2">บริการเพิ่มเติม</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {services.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`service-${item.id}`}
                                            value={item.id.toString()}
                                            checked={roomData.other_services.includes(item.id.toString())}
                                            onChange={() => handleCheckboxChange('other_services', item.id.toString())}
                                        />
                                        <Label htmlFor={`service-${item.id}`}>{item.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm py-2 rounded-xl transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </Button>
                    </form>
                </div>
            </div>
            <Footer className="fixed-footer" />
        </>
    );
};

export default EditRoomPage;
