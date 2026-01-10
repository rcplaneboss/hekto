"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import React from 'react'

interface Props {
  data: { date: string; amount: number }[]
}

export default function RevenueChart({ data }: Props) {
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `₦${Number(v).toLocaleString()}`} />
          <Tooltip formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
          <Area type="monotone" dataKey="amount" stroke="#7c3aed" fillOpacity={1} fill="url(#colorAmt)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
