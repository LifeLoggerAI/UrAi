'use client';

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Basic chart context and types
interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a Chart component');
  }
  return context;
}

// Chart container component
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({ 
  config, 
  children, 
  className,
  ...props 
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("w-full h-full", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  );
}

// Basic chart tooltip component
interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded shadow-lg p-2">
      {label && <p className="font-medium">{label}</p>}
      {payload.map((item, index) => (
        <p key={index} className="text-sm">
          <span style={{ color: item.color }}>●</span> {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

// Basic chart legend component
interface ChartLegendProps {
  payload?: any[];
}

export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 mt-4">
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// Export commonly used recharts components (these would be the actual recharts in real usage)
export { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';