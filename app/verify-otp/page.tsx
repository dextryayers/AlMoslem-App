'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { backendClient } from '../lib/backend';
import { useSettings } from '../context/SettingsContext';
import { Lock, RefreshCw } from 'lucide-react';

function VerifyOtpContent() {
  const { t } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('OTP must be 6 characters');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await backendClient.post('/api/verify-otp', {
        email,
        otp,
      });

      Swal.fire({
        icon: 'success',
        title: t('verify'),
        text: 'Verification Successful! Please login.',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#10B981',
      }).then(() => {
        router.push('/login');
      });

    } catch (err: any) {
      console.error('Verification error:', err);
      const errorMessage = err.response?.data?.message || t('invalidOtp');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await backendClient.post('/api/resend-otp', { email });
      Swal.fire({
        icon: 'success',
        title: t('otpSent'),
        text: t('otpDescription'),
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#10B981',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to resend OTP',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222831] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md p-8 bg-[#2D333B] rounded-xl border border-gray-800 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('verifyOtp')}</h1>
            <p className="text-gray-400 mt-2 text-center">{t('otpDescription')}</p>
            <p className="text-emerald-500 text-sm mt-1">{email}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                className="w-full px-4 py-4 bg-[#222831] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-gray-600"
                placeholder="A1B2C3"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : t('verify')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              {t('resendCode')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#222831]" />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
