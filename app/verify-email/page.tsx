'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Mail } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import SubmitButton from '../components/SubmitButton';
import { backendClient } from '../lib/backend';
import { useSettings } from '../context/SettingsContext';

function VerifyEmailContent() {
  const { t } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await backendClient.post('/api/verify-otp', {
        email: emailParam,
        otp: otp
      });

      // Assuming response contains token
      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Verified!',
        text: 'Your email has been successfully verified.',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#10B981'
      }).then(() => {
        // Since this might be from Google Sign In, we might need to tell them to sign in again
        // or if we have the token (which we do), we can just go to profile.
        // However, if they came from Google Sign In flow interruption, NextAuth session is NOT established.
        // But we have the backend token.
        // We can redirect to profile.
        // Note: NextAuth session won't be active, so client-side calls relying on NextAuth session will fail
        // but calls using localStorage token will work.
        // To fix NextAuth session, we'd need them to sign in again.
        
        Swal.fire({
          icon: 'info',
          title: 'Please Sign In Again',
          text: 'Verification successful! Please sign in with Google again to complete the process.',
          background: '#222831',
          color: '#fff',
          confirmButtonColor: '#10B981'
        }).then(() => {
             router.push('/login');
        });
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Invalid OTP',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
        await backendClient.post('/api/resend-otp', { email: emailParam });
        Swal.fire({
            icon: 'success',
            title: 'OTP Resent',
            text: 'Please check your email.',
            background: '#222831',
            color: '#fff',
            confirmButtonColor: '#10B981'
        });
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#222831] text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-[#393E46] p-8 rounded-2xl shadow-xl border border-gray-700">
            <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
            <p className="text-gray-400 mb-8">We sent an OTP code to <span className="text-emerald-400">{emailParam}</span>. Please enter it below.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#222831] border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
              </div>

              <SubmitButton 
                loading={loading} 
                text="Verify Email" 
                loadingText="Verifying..." 
              />
              
              <div className="text-center mt-4">
                  <button type="button" onClick={handleResend} className="text-sm text-emerald-500 hover:text-emerald-400">Resend OTP</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#222831] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
