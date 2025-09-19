// src/components/dashboard/LeadsByStatusChart.tsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LEAD_STATUS_OPTIONS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface LeadsByStatusChartProps {
  leads: LeadRow[];
  className?: string;
}

const LeadsByStatusChart = ({ leads, className }: LeadsByStatusChartProps) => {
  const navigate = useNavigate();

  const getStatusColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#F59E0B',
      orange: '#F97316',
      emerald: '#059669',
      red: '#EF4444',
      gray: '#6B7280',
    };
    return colorMap[color] || '#6B7280';
  };

  const chartData = useMemo(() => {
    // Count leads by status
    const statusCounts = LEAD_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status.value || 'New Lead'] = 0;
      return acc;
    }, {} as Record<string, number>);

    leads.forEach((lead) => {
      const status = lead.status || 'New Lead';
      if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
        statusCounts[status]++;
      }
    });

    // Convert to chart format
    return LEAD_STATUS_OPTIONS.map((status) => ({
      name: status.label,
      value: statusCounts[status.value || 'New Lead'],
      status: status.value || 'New Lead',
      color: getStatusColor(status.color),
    }));
  }, [leads]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarClick = (data: any) => {
    navigate('/lead-database', {
      state: { statusFilter: data.status }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
          <p className="text-[var(--color-text-primary)] font-medium">{label}</p>
          <p className="text-[var(--color-text-secondary)]">
            {payload[0].value} leads
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Click to view filtered leads
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
          Leads by Status
        </CardTitle>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Sales funnel overview - click bars to drill down
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-muted)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={handleBarClick}
              >
                {chartData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsByStatusChart;
