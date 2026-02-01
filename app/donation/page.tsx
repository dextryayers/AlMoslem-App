'use client';

import { useState } from 'react';
import Header from '../components/Header';
import { Copy, Check, Wallet, Smartphone, CreditCard, ShoppingBag } from 'lucide-react';

export default function DonationPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const wallets = [
    {
      id: 'dana',
      name: 'DANA',
      number: '0823-3243-0578',
      holder: 'Hanif Abdurrohim',
      color: 'bg-[#118EE9]',
      textColor: 'text-white',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Dompet Digital Indonesia'
    },
    {
      id: 'ovo',
      name: 'OVO',
      number: '0823-3243-0578',
      holder: 'Hanif Abdurrohim',
      color: 'bg-[#4C3494]',
      textColor: 'text-white',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Payment & Points'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      number: '0823-3243-0578',
      holder: 'Hanif Abdurrohim',
      color: 'bg-[#00AED6]',
      textColor: 'text-white',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Gojek Payment'
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      number: '0823-3243-0578',
      holder: 'Hanif Abdurrohim',
      color: 'bg-[#EE4D2D]',
      textColor: 'text-white',
      icon: <ShoppingBag className="w-6 h-6" />,
      description: 'Shopee Payment'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0f1219] font-sans">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dukungan Pengembangan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bantu kami terus mengembangkan <span className="font-semibold text-emerald-600 dark:text-emerald-400">Al-Moslem</span> agar tetap gratis, bebas iklan, dan bermanfaat bagi umat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wallets.map((wallet) => (
            <div 
              key={wallet.id}
              className="bg-white dark:bg-[#222831] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
            >
              {/* Card Header */}
              <div className={`${wallet.color} ${wallet.textColor} p-6 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {wallet.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-wide">{wallet.name}</h3>
                    <p className="text-xs opacity-90">{wallet.description}</p>
                  </div>
                </div>
                <div className="text-white/20">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="absolute -right-4 -top-4 opacity-20 transform rotate-12 scale-150">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Atas Nama</label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{wallet.holder}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nomor Rekening / E-Wallet</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 dark:bg-[#1a1f2e] text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg font-mono text-lg font-semibold tracking-wider border border-gray-200 dark:border-gray-700">
                        {wallet.number}
                      </code>
                      <button
                        onClick={() => handleCopy(wallet.number, wallet.id)}
                        className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[50px] ${
                          copiedId === wallet.id 
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-lg' 
                            : 'bg-gray-100 dark:bg-[#393E46] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title="Salin Nomor"
                      >
                        {copiedId === wallet.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {copiedId === wallet.id && (
                  <div className="mt-4 text-center">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full animate-fade-in">
                      Nomor berhasil disalin!
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            "Apabila manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak sholeh yang mendoakannya." (HR. Muslim)
          </p>
        </div>
      </div>
    </main>
  );
}
