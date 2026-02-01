'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, ChevronDown, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { cn } from '../lib/utils';

// Types
interface ScheduleData {
  tanggal: string;
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface ScheduleResponse {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: ScheduleData[];
}

export default function JadwalSolatPage() {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await axios.get('https://equran.id/api/v2/shalat/provinsi');
        if (res.data.code === 200) {
          setProvinces(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch provinces', err);
        setError('Gagal memuat data provinsi');
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Cities when Province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await axios.post('https://equran.id/api/v2/shalat/kabkota', {
          provinsi: selectedProvince
        });
        if (res.data.code === 200) {
          setCities(res.data.data);
          setSelectedCity(''); // Reset city
        }
      } catch (err) {
        console.error('Failed to fetch cities', err);
        setError('Gagal memuat data kota/kabupaten');
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedProvince]);

  // Fetch Schedule when City changes
  useEffect(() => {
    if (!selectedCity || !selectedProvince) {
      setSchedule(null);
      return;
    }
    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      try {
        // Default to current month/year if not specified
        const now = new Date();
        const res = await axios.post('https://equran.id/api/v2/shalat', {
          provinsi: selectedProvince,
          kabkota: selectedCity,
          bulan: now.getMonth() + 1,
          tahun: now.getFullYear()
        });
        if (res.data.code === 200) {
          setSchedule(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch schedule', err);
        setError('Gagal memuat jadwal shalat');
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchSchedule();
  }, [selectedCity, selectedProvince]);

  // Highlight today's row
  const today = new Date().toLocaleDateString('fr-CA'); // Returns YYYY-MM-DD in local time


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#222831]">
      <Header />
      
      <div className="pt-24 pb-12 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 font-arabic">
              Jadwal Shalat
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Jadwal shalat lengkap untuk seluruh wilayah Indonesia
            </p>
          </div>

          {/* Selection Card */}
          <div className="bg-white dark:bg-[#2c3440] rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Province Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Provinsi
                </label>
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    disabled={loadingProvinces}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* City Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Kota / Kabupaten
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-[#222831] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedProvince || loadingCities}
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {loadingCities ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Display */}
          {loadingSchedule && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          )}

          {schedule && !loadingSchedule && (
            <div className="bg-white dark:bg-[#2c3440] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
              <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700/50 bg-emerald-50/50 dark:bg-[#38598b]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {schedule.kabkota}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {schedule.provinsi}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-100/50 dark:bg-[#38598b]/20 px-4 py-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                  {schedule.bulan_nama} {schedule.tahun}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-[#222831]/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Tanggal</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Imsak</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Subuh</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Dzuhur</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Ashar</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Maghrib</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Isya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {schedule.jadwal.map((day) => {
                      const isToday = day.tanggal_lengkap === today;
                      return (
                        <tr 
                          key={day.tanggal} 
                          className={cn(
                            "transition-colors hover:bg-gray-50 dark:hover:bg-[#222831]/50",
                            isToday ? "bg-emerald-50/80 dark:bg-emerald-900/20" : ""
                          )}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{day.tanggal} {schedule.bulan_nama}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{day.hari}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">{day.imsak}</td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">{day.subuh}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">{day.dzuhur}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">{day.ashar}</td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">{day.maghrib}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">{day.isya}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!schedule && !loadingSchedule && !error && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Silakan pilih Provinsi dan Kota untuk melihat jadwal shalat</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
