'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, RefreshCw, ChevronLeft, Menu, X, Lock, LogIn, MessageSquare, Info, Trash2, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function UstazAIPage() {
  const { t, language } = useSettings();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    t('sq1'),
    t('sq2'),
    t('sq3'),
    t('sq4'),
  ];

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        // Determine time-based greeting
        const hour = new Date().getHours();
        let timeGreetingKey = 'goodMorning';
        
        // Pagi: 05:00 - 11:00
        // Siang: 11:00 - 15:00
        // Sore: 15:00 - 18:00
        // Malam: 18:00 - 05:00
        if (hour >= 5 && hour < 11) {
          timeGreetingKey = 'goodMorning';
        } else if (hour >= 11 && hour < 15) {
          timeGreetingKey = 'goodAfternoon';
        } else if (hour >= 15 && hour < 18) {
          timeGreetingKey = 'goodEvening';
        } else {
          timeGreetingKey = 'goodNight';
        }

        let greeting = '';
        if (language === 'id') {
             greeting = `Assalamualaikum, ${t(timeGreetingKey as any)} Sahabat! 👋 ${t('ustazAiIntro')}`;
        } else if (language === 'en') {
             greeting = `Assalamualaikum, ${t(timeGreetingKey as any)} Friend! 👋 ${t('ustazAiIntro')}`;
        } else if (language === 'es') {
             greeting = `¡Assalamualaikum, ${t(timeGreetingKey as any)} Amigo! 👋 ${t('ustazAiIntro')}`;
        } else if (language === 'ru') {
             greeting = `Ассаляму алейкум, ${t(timeGreetingKey as any)} друг! 👋 ${t('ustazAiIntro')}`;
        } else if (language === 'ja') {
             greeting = `アッサラーム・アライクム、${t(timeGreetingKey as any)}！👋 ${t('ustazAiIntro')}`;
        } else if (language === 'de') {
             greeting = `Friede sei mit dir, ${t(timeGreetingKey as any)} Freund! 👋 ${t('ustazAiIntro')}`;
        } else {
             greeting = `${t('ustazAiGreeting')} ${t('ustazAiIntro')}`;
        }

        setMessages([
          {
            role: 'assistant',
            content: greeting
          }
        ]);
        setHasGreeted(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted, t, language]);

  const handleSubmit = async (e?: React.FormEvent, customMessage?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = messageToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ust-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('error'));
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || t('ustazAiConnectionError')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        {/* Loading Animation */}
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-8">
                {/* Outer rotating rings */}
                <div className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-2 border-4 border-teal-500/20 border-b-teal-500 rounded-full animate-spin [animation-duration:2s] reverse"></div>
                
                {/* Center pulsing icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                </div>
                
                {/* Floating sparkles */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-bounce [animation-duration:2s]" />
                <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-emerald-400 animate-bounce [animation-duration:2.5s] delay-75" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
                {t('ustazAi')}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('loading')}</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent text-gray-900 dark:text-white flex flex-col font-sans overflow-hidden relative transition-colors duration-300">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-[100px] animate-pulse [animation-delay:4s]"></div>
      </div>

      <Header />
      
      {status === 'unauthenticated' ? (
        <main className="flex-1 container mx-auto px-4 pt-24 pb-4 md:pb-8 max-w-5xl flex flex-col h-screen z-10 items-center justify-center">
           <div className="bg-white/80 dark:bg-[#1F2937]/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 max-w-lg w-full text-center relative overflow-hidden group">
               {/* Shine effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
               
               <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-50 dark:ring-emerald-900/20">
                   <Lock className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
               </div>
               
               <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">{t('premiumFeature')}</h2>
               <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                   {t('unlockUstazAi')}
               </p>
               
               <div className="flex flex-col gap-3">
                   <Button 
                      onClick={() => router.push('/login')}
                      className="w-full h-auto py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                       <LogIn className="w-5 h-5" />
                       {t('login')}
                   </Button>
                   <Button 
                      onClick={() => router.push('/register')}
                      variant="outline"
                      className="w-full h-auto py-3.5 px-6 bg-white dark:bg-transparent border-2 border-emerald-600/20 hover:border-emerald-600 text-emerald-700 dark:text-emerald-400 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                   >
                       {t('register')}
                   </Button>
               </div>
           </div>
        </main>
      ) : (
      <main className="flex-1 container mx-auto px-4 pt-24 pb-4 md:pb-8 max-w-5xl flex flex-col h-screen z-10 relative">
        {/* Sidebar Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#1a1f2e] border-r border-gray-200 dark:border-white/5 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Ustaz AI</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
               <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/10">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    About
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                    {t('ustazAiDescription')}
                  </p>
               </div>
            </div>

            <div className="mt-auto">
               <Button 
                onClick={() => {
                  setMessages([]);
                  setHasGreeted(false);
                  setIsSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full h-auto py-3 px-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
               >
                 <Trash2 className="w-4 h-4" />
                 {t('resetChat')}
               </Button>
            </div>
          </div>
        </div>

        {/* Glassmorphism Chat Container */}
        <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-gray-200 dark:ring-white/5 transition-colors duration-300">
          
          {/* Header Bar */}
          <div className="px-4 md:px-6 py-4 bg-white/60 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 transition-colors duration-300">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20">
                  <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white dark:border-[#1a1f2e] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                  {t('ustazAi')}
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">{t('premium')}</span>
                </h1>
                <p className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-200/80 font-medium">{t('ustazAiSubtitle')}</p>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setMessages([]);
                setHasGreeted(false);
              }} 
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group h-10 w-10 md:h-11 md:w-11"
              title={t('resetChat')}
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </div>

          {/* Chat Messages Area */}
          <div 
            ref={scrollAreaRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-white/20"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 animate-bounce [animation-duration:3s]">
                  <Sparkles className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('startConversation')}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  {t('ustazAiDescription')}
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/10 mt-1">
                    <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 md:px-6 py-3 md:py-4 shadow-sm backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-sm shadow-emerald-900/20 border border-emerald-500/20'
                      : 'bg-white dark:bg-[#2D333B]/80 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                  }`}
                >
                  <div className={`prose dark:prose-invert prose-sm md:prose-base max-w-none ${message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                    <ReactMarkdown 
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed tracking-wide">{children}</p>,
                        strong: ({children}) => <strong className={`font-bold ${message.role === 'user' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>{children}</strong>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1 marker:text-emerald-500">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1 marker:text-emerald-500">{children}</ol>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-emerald-500/50 pl-4 italic text-gray-600 dark:text-gray-300 my-3 bg-gray-50 dark:bg-white/5 py-2 pr-2 rounded-r-lg">{children}</blockquote>,
                        code: ({children}) => <code className="bg-black/10 dark:bg-black/30 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-300 font-mono text-xs">{children}</code>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className={`text-[10px] mt-2 opacity-60 flex items-center gap-1 ${message.role === 'user' ? 'justify-end text-emerald-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>{new Date().toLocaleTimeString(language === 'id' ? 'id-ID' : language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
                    {message.role === 'assistant' && <Sparkles className="w-3 h-3" />}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 flex items-center justify-center shadow-lg mt-1 border border-white/10">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-200" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Suggested Questions */}
            {messages.length === 1 && messages[0].role === 'assistant' && (
              <div className="py-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1 uppercase tracking-wider">{t('suggestedQuestions')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((question, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleSubmit(undefined, question)}
                      variant="outline"
                      className="h-auto text-left px-4 py-2.5 rounded-xl justify-start bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-200 shadow-sm gap-2 group whitespace-normal"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500 transition-colors shrink-0" />
                      <span>{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-emerald-500/50" />
                </div>
                <div className="bg-white dark:bg-[#2D333B]/60 rounded-3xl rounded-bl-sm px-6 py-5 border border-gray-100 dark:border-white/5 flex items-center gap-2 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <Button
              onClick={scrollToBottom}
              size="icon"
              className="absolute bottom-24 right-6 h-12 w-12 bg-white dark:bg-[#1F2937] text-emerald-600 dark:text-emerald-400 rounded-full shadow-lg border border-gray-100 dark:border-white/10 z-30 animate-in fade-in zoom-in duration-300 hover:scale-110 hover:bg-gray-50 dark:hover:bg-[#2d3748] transition-transform"
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-[#111827] dark:via-[#111827]/80 dark:to-transparent/0 backdrop-blur-sm z-20 transition-colors duration-300">
            <div className="relative max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm group-focus-within:opacity-100 group-focus-within:blur-md"></div>
                <div className="relative flex items-center bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden transition-colors duration-300">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('askSomething')}
                    className="w-full h-auto bg-transparent border-none focus-visible:ring-0 shadow-none text-gray-900 dark:text-white py-4 pl-6 pr-16 placeholder-gray-400 dark:placeholder-gray-500 text-lg font-medium"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="absolute right-2 h-11 w-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30 active:scale-95 border-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              </form>
              <p className="text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{t('ustazAiDisclaimer')}</span>
              </p>
            </div>
          </div>
          
        </div>
      </main>
      )}
    </div>
  );
}
