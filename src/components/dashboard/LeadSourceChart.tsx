// src/components/dashboard/LeadSourceChart.tsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LEAD_SOURCE_OPTIONS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface LeadSourceChartProps {
  leads: LeadRow[];
  className?: string;
}

const COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
];

const LeadSourceChart = ({ leads, className }: LeadSourceChartProps) => {
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    // Count leads by source
    const sourceCounts = LEAD_SOURCE_OPTIONS.reduce((acc, source) => {
      acc[source.value || 'Website'] = 0;
      return acc;
    }, {} as Record<string, number>);

    leads.forEach((lead) => {
      const source = lead.lead_source || 'Website';
      if (sourceCounts.hasOwnProperty(source)) {
        sourceCounts[source]++;
      }
    });

    // Convert to chart format and filter out zero values
    return LEAD_SOURCE_OPTIONS
      .map((source, index) => ({
        name: source.label,
        value: sourceCounts[source.value || 'Website'],
        source: source.value || 'Website',
        color: COLORS[index % COLORS.length],
      }))
      .filter((item) => item.value > 0);
  }, [leads]);

  const handleCellClick = (data: any) => {
    navigate('/lead-database', {
      state: { sourceFilter: data.source }
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / leads.length) * 100).toFixed(1);
      
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--color-text-primary)] font-medium">{data.name}</p>
          <p className="text-[var(--color-text-secondary)]">
            {data.value} leads ({percentage}%)
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Click to view filtered leads
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleCellClick(entry.payload)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
          Lead Sources
        </CardTitle>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Where your leads are coming from - click to drill down
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    onClick={() => handleCellClick(entry)}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadSourceChart;
