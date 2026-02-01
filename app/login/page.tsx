'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import SubmitButton from '../components/SubmitButton';
import { useSettings } from '../context/SettingsContext';

type ExtendedSession = Session & {
  accessToken?: string;
  user?: Session['user'] & { dbId?: string | number };
};

export default function LoginPage() {
  const { t } = useSettings();
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const extendedSession = session as ExtendedSession | null;

    if (extendedSession) {
      const token = extendedSession.accessToken;
      const user = extendedSession.user;
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          name: user.name,
          email: user.email,
          id: user.dbId
        }));
        router.push('/profile');
      }
    }
  }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError(t('invalidEmailOrPassword'));
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: t('invalidEmailOrPassword'),
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#EF4444'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        background: '#222831',
        color: '#fff',
        confirmButtonColor: '#10B981',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        router.push('/profile');
      });
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen bg-[#222831] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md p-8 bg-[#2D333B] rounded-xl border border-gray-800 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('welcomeBack')}</h1>
            <p className="text-gray-400 mt-2">{t('signInToAccount')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <FcGoogle className="w-6 h-6" />
              {t('signInWithGoogle')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#2D333B] text-gray-500">{t('orContinueWithEmail')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-[#222831] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-white placeholder-gray-500"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-[#222831] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-white placeholder-gray-500 pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
                  {t('forgotPassword') || 'Forgot Password?'}
                </Link>
              </div>
            </div>

            <SubmitButton 
              loading={loading}
              text={t('signIn')}
              loadingText={t('loading')}
            />
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            {t('dontHaveAccount')}{' '}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              {t('createAccount')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
