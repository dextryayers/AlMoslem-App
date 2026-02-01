'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import SubmitButton from '../components/SubmitButton';
import { backendClient } from '../lib/backend';
import { useSettings } from '../context/SettingsContext';

export default function ForgotPasswordPage() {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await backendClient.post('/api/forgot-password', { email });
      
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Please check your email for the OTP code to reset your password.',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#10B981'
      }).then(() => {
        // Redirect to Reset Password page (we need to create this too or handle it here)
        // Usually, we redirect to a page where they enter OTP and New Password
        window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send OTP',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="bg-[#393E46] p-8 rounded-2xl shadow-xl border border-gray-700">
            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
            <p className="text-gray-400 mb-8">Enter your email to receive a reset code.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#222831] border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <SubmitButton 
                loading={loading} 
                text="Send Reset Code" 
                loadingText="Sending..." 
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
