'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { LastRead } from '../context/BookmarkContext';

interface ActivityChartProps {
  history: LastRead[];
  locale: string;
  t: (key: any) => string;
}

export default function ActivityChart({ history, locale, t }: ActivityChartProps) {
  const data = useMemo(() => {
    // Group by date
    const grouped = history.reduce((acc, item) => {
      // Use local date string to group by day
      const date = new Date(item.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD format is sortable
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate data for the last 7 days
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('en-CA');
      
      // Map app locale to BCP 47 tag if necessary, or use as is
      const dateLocale = locale === 'id' ? 'id-ID' : 
                        locale === 'en' ? 'en-US' : 
                        locale === 'es' ? 'es-ES' : 
                        locale === 'ru' ? 'ru-RU' : 
                        locale === 'ja' ? 'ja-JP' : 
                        locale === 'de' ? 'de-DE' : 'id-ID';

      // Format for display (e.g., "29 Jan")
      const displayDate = d.toLocaleDateString(dateLocale, { 
        day: 'numeric', 
        month: 'short' 
      });
      
      result.push({
        date: displayDate,
        count: grouped[dateKey] || 0,
        fullDate: dateKey
      });
    }
    return result;
  }, [history, locale]);

  return (
    <div className="w-full h-[300px] mt-4 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '12px', 
              color: '#fff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#10B981' }}
            cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(value: any) => [`${value}`, t('versesRead')]}
            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#10B981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
