import { useState, useMemo } from 'react';
import { subDays, isAfter, parseISO } from 'date-fns';
import { useLeads } from '../hooks/queries/useLeads';
import { useTasks } from '../hooks/queries/useTasks';
import { useAuth } from '../hooks/useAuth';
import { DollarSign, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCard from '../components/dashboard/StatCard';
import LeadsByStatusChart from '../components/dashboard/LeadsByStatusChart';
import LeadSourceChart from '../components/dashboard/LeadSourceChart';
import TodaysAgenda from '../components/dashboard/TodaysAgenda';

function DashboardPage() {
  const { profile } = useAuth();
  const [dateRange, setDateRange] = useState('30d');

  // Data fetching
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  
  // Combined loading state
  const isLoading = leadsLoading || tasksLoading;

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;

    switch (dateRange) {
      case '30d':
        cutoffDate = subDays(now, 30);
        break;
      case '90d':
        cutoffDate = subDays(now, 90);
        break;
      case '180d':
        cutoffDate = subDays(now, 180);
        break;
      case '365d':
        cutoffDate = subDays(now, 365);
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    const filteredLeads = dateRange === 'all' ? leads : leads.filter(lead => 
      lead.created_at && isAfter(parseISO(lead.created_at), cutoffDate)
    );

    const filteredTasks = dateRange === 'all' ? tasks : tasks.filter(task => 
      task.created_at && isAfter(parseISO(task.created_at), cutoffDate)
    );

    return { leads: filteredLeads, tasks: filteredTasks };
  }, [leads, tasks, dateRange]);

  // Calculate metrics with previous period comparison
  const metrics = useMemo(() => {
    const { leads: currentLeads, tasks: currentTasks } = filteredData;
    
    // Calculate previous period data for comparison
    const now = new Date();
    let previousCutoffDate: Date;
    let previousStartDate: Date;

    switch (dateRange) {
      case '30d':
        previousCutoffDate = subDays(now, 30);
        previousStartDate = subDays(now, 60);
        break;
      case '90d':
        previousCutoffDate = subDays(now, 90);
        previousStartDate = subDays(now, 180);
        break;
      case '180d':
        previousCutoffDate = subDays(now, 180);
        previousStartDate = subDays(now, 360);
        break;
      case '365d':
        previousCutoffDate = subDays(now, 365);
        previousStartDate = subDays(now, 730);
        break;
      default:
        // For "all time", compare with half the data
        const totalDays = leads.length > 0 ? 
          Math.floor((now.getTime() - new Date(Math.min(...leads.map(l => new Date(l.created_at || 0).getTime()))).getTime()) / (1000 * 60 * 60 * 24)) : 
          30;
        previousCutoffDate = subDays(now, totalDays / 2);
        previousStartDate = new Date(0);
    }

    const previousLeads = dateRange === 'all' ? 
      leads.slice(0, Math.floor(leads.length / 2)) :
      leads.filter(lead => 
        lead.created_at && 
        isAfter(parseISO(lead.created_at), previousStartDate) &&
        !isAfter(parseISO(lead.created_at), previousCutoffDate)
      );

    // Pipeline Value (sum of potential_mrr for open leads)
    const currentPipelineValue = currentLeads
      .filter(lead => !['Won', 'Lost'].includes(lead.status || ''))
      .reduce((sum, lead) => sum + (lead.potential_mrr || 0), 0);

    const previousPipelineValue = previousLeads
      .filter(lead => !['Won', 'Lost'].includes(lead.status || ''))
      .reduce((sum, lead) => sum + (lead.potential_mrr || 0), 0);

    // Conversion Rate
    const currentWonLeads = currentLeads.filter(lead => lead.status === 'Won').length;
    const currentConversionRate = currentLeads.length > 0 ? (currentWonLeads / currentLeads.length) * 100 : 0;

    const previousWonLeads = previousLeads.filter(lead => lead.status === 'Won').length;
    const previousConversionRate = previousLeads.length > 0 ? (previousWonLeads / previousLeads.length) * 100 : 0;

    // New Leads
    const newLeadsCount = currentLeads.length;
    const previousNewLeadsCount = previousLeads.length;

    // Overdue Tasks (for current user) - using assignee_id
    const userOverdueTasks = currentTasks.filter(task => 
      task.assignee_id === profile?.id && 
      task.status !== 'Done' &&
      task.due_date &&
      new Date(task.due_date) < now
    ).length;

    const previousUserOverdueTasks = tasks.filter(task => 
      task.assignee_id === profile?.id && 
      task.status !== 'Done' &&
      task.due_date &&
      new Date(task.due_date) < previousCutoffDate
    ).length;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      pipelineValue: {
        current: currentPipelineValue,
        change: calculateChange(currentPipelineValue, previousPipelineValue)
      },
      conversionRate: {
        current: currentConversionRate,
        change: calculateChange(currentConversionRate, previousConversionRate)
      },
      newLeads: {
        current: newLeadsCount,
        change: calculateChange(newLeadsCount, previousNewLeadsCount)
      },
      overdueTasks: {
        current: userOverdueTasks,
        change: calculateChange(userOverdueTasks, previousUserOverdueTasks)
      }
    };
  }, [filteredData, dateRange, leads, tasks, profile?.id]);

  // Show loading skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Open Pipeline Value"
          value={`$${(metrics.pipelineValue.current / 1000).toFixed(0)}K`}
          change={metrics.pipelineValue.change}
          icon={<DollarSign className="h-6 w-6" />}
        />
        
        <StatCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.current.toFixed(1)}%`}
          change={metrics.conversionRate.change}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        
        <StatCard
          title="New Leads"
          value={metrics.newLeads.current}
          change={metrics.newLeads.change}
          icon={<Users className="h-6 w-6" />}
        />
        
        <StatCard
          title="My Overdue Tasks"
          value={metrics.overdueTasks.current}
          change={metrics.overdueTasks.change}
          icon={<AlertTriangle className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LeadsByStatusChart leads={filteredData.leads} />
        <LeadSourceChart leads={filteredData.leads} />
      </div>

      {/* Today's Agenda */}
      <TodaysAgenda tasks={tasks} />
    </div>
  );
}

export default DashboardPage;
