"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LanguageChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p className="text-zinc-500">No language data found.</p>;

  // 1. The Multiline Label Trick
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, x, y }: any) => {
    const isLeft = x < cx;
    const xOffset = isLeft ? -8 : 8;

    return (
      <text 
        x={x + xOffset} 
        y={y} 
        textAnchor={isLeft ? 'end' : 'start'} 
        dominantBaseline="central" 
      >
        {/* Top Line: Language Name */}
        <tspan x={x + xOffset} dy="-0.4em" fontSize="14" fontWeight="600" fill="#f4f4f5">
          {name}
        </tspan>
        {/* Bottom Line: Percentage */}
        <tspan x={x + xOffset} dy="1.4em" fontSize="12" fontWeight="400" fill="#a1a1aa">
          {(percent * 100).toFixed(0)}%
        </tspan>
      </text>
    );
  };

  return (
        <div className="w-full bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col" style={{ height: '450px' }}>
        <h2 className="text-base font-bold mb-2 text-white">Language Breakdown</h2>
        
        <div className="grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* 2. Shrunk the margins back down to 60px so the pie has room to grow! */}
          <PieChart 
            margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
            style={{ overflow: 'visible' }}
          >
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius="50%" 
              outerRadius="80%" /* 3. The Pie is massive again! */
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              label={renderCustomLabel}
              labelLine={{ stroke: '#71717a', strokeWidth: 1.5 }} // Made the pointing lines slightly shorter
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || '#52525b'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ color: '#a1a1aa', fontSize: '13px' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}