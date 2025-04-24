import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Label, TextInput, FileInput, Select, Checkbox } from 'flowbite-react';
import Header from '../../../Header/HeaderMember';
import Footer from '../../../Footer/FootersMember';

interface OptionType {
  id: number;
  name: string;
}

const AddRoomPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_URL;

  const [roomData, setRoomData] = useState({
    id_type_room: '',
    id_type_view: '',
    price: '',
    people: '',
    size_room: '',
    amenities: [] as string[],
    bathrooms: [] as string[],
    other_services: [] as string[],
    start_date: '',
    end_date: ''
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roomTypes, setRoomTypes] = useState<OptionType[]>([]);
  const [viewTypes, setViewTypes] = useState<OptionType[]>([]);
  const [amenities, setAmenities] = useState<OptionType[]>([]);
  const [bathrooms, setBathrooms] = useState<OptionType[]>([]);
  const [services, setServices] = useState<OptionType[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [roomTypesRes, viewTypesRes, amenitiesRes, bathroomsRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/room-meta/room-types`),
          axios.get(`${API_URL}/room-meta/view-types`),
          axios.get(`${API_URL}/room-meta/amenities`),
          axios.get(`${API_URL}/room-meta/bathrooms`),
          axios.get(`${API_URL}/room-meta/other-services`)
        ]);
        setRoomTypes(roomTypesRes.data);
        setViewTypes(viewTypesRes.data);
        setAmenities(amenitiesRes.data);
        setBathrooms(bathroomsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('❌ Error loading room metadata:', error);
      }
    };

    fetchOptions();
  }, [API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
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
    formData.append('hotelId', hotelId || '');

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      await axios.post(`${API_URL}/rooms`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/hotel/${hotelId}`);
    } catch (error) {
      console.error('Error adding room:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มห้อง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxGroup = (key: keyof typeof roomData, value: string, checked: boolean) => {
    setRoomData((prev) => {
      const updated = checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter((id) => id !== value);
      return { ...prev, [key]: updated };
    });
  };

  return (
    <>
      <Header className="fixed-header" />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[88px] pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl px-6 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">เพิ่มห้องในโรงแรม</h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="id_type_room" className="mb-1 block">ประเภทห้อง</Label>
                <Select name="id_type_room" onChange={handleChange} required>
                  <option value="">เลือก</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="id_type_view" className="mb-1 block">วิว</Label>
                <Select name="id_type_view" onChange={handleChange} required>
                  <option value="">เลือก</option>
                  {viewTypes.map((view) => (
                    <option key={view.id} value={view.id}>{view.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className="mb-1 block">ราคา</Label>
                <TextInput name="price" type="number" onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="people" className="mb-1 block">จำนวนผู้เข้าพัก</Label>
                <TextInput name="people" type="number" onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="size_room" className="mb-1 block">ขนาดห้อง</Label>
                <TextInput name="size_room" onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">เริ่มวันที่</Label>
                <TextInput name="start_date" type="date" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="end_date">สิ้นสุดวันที่</Label>
                <TextInput name="end_date" type="date" onChange={handleChange} />
              </div>
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
                      onChange={(e) => handleCheckboxGroup('amenities', item.id.toString(), e.target.checked)}
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
                      onChange={(e) => handleCheckboxGroup('bathrooms', item.id.toString(), e.target.checked)}
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
                      onChange={(e) => handleCheckboxGroup('other_services', item.id.toString(), e.target.checked)}
                    />
                    <Label htmlFor={`service-${item.id}`}>{item.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="block mb-2">อัปโหลดรูปภาพห้อง</Label>
              <FileInput multiple onChange={handleImageChange} />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm py-2 rounded-xl transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกห้อง'}
            </Button>
          </form>
        </div>
      </div>
      <Footer className="fixed-footer" />
    </>
  );
};

export default AddRoomPage;