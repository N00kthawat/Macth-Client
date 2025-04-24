// src/pages/Login/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextInput, Label, Checkbox } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { email, password };
      // console.log('Sending data:', data);
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // console.log('Login successful. Token:', token);
      navigate('/explore-member', { state: { token } });
    } catch (error: any) {
      console.error('Error logging in:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        if (error.response.status === 401) {
          alert('Invalid email or password.');
        } else {
          alert('An error occurred. Please try again.');
        }
      } else {
        alert('An error occurred. Please try again.');
      }
      setError(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/lobby-blur.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40"></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 relative bg-white/90 backdrop-blur-lg shadow-2xl p-8 rounded-3xl w-full max-w-md space-y-6 animate-fadeIn"
      >
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Macth
          </h1>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to continue.</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-[32px] text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition font-medium py-2 rounded-lg"
        >
          เข้าสู่ระบบ
        </Button>

        <div className="text-center text-gray-500">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            สร้างบัญชีใหม่
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
