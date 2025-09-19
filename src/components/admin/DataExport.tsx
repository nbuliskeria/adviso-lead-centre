// src/components/admin/DataExport.tsx
import { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database, 
  Calendar,
  Users,
  Building2,
  CheckSquare,
  Filter,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLeads } from '../../hooks/queries/useLeads';
import { useTasks } from '../../hooks/queries/useTasks';
import { useUsers } from '../../hooks/queries/useUsers';
import { format, subDays } from 'date-fns';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  dataType: 'leads' | 'tasks' | 'users' | 'activities';
  formats: ('csv' | 'json' | 'xlsx')[];
}

const DataExport = () => {
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('all');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const { data: leads } = useLeads();
  const { data: tasks } = useTasks();
  const { data: users } = useUsers();

  const exportOptions: ExportOption[] = [
    {
      id: 'leads',
      title: 'Lead Database',
      description: `Export all ${leads?.length || 0} leads with complete details`,
      icon: Building2,
      dataType: 'leads',
      formats: ['csv', 'json', 'xlsx']
    },
    {
      id: 'tasks',
      title: 'Task Management',
      description: `Export all ${tasks?.length || 0} tasks with assignments and status`,
      icon: CheckSquare,
      dataType: 'tasks',
      formats: ['csv', 'json', 'xlsx']
    },
    {
      id: 'users',
      title: 'User Profiles',
      description: `Export all ${users?.length || 0} user profiles and roles`,
      icon: Users,
      dataType: 'users',
      formats: ['csv', 'json', 'xlsx']
    },
    {
      id: 'activities',
      title: 'Activity Logs',
      description: 'Export system activity and audit trail',
      icon: Clock,
      dataType: 'activities',
      formats: ['csv', 'json']
    }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  const toggleExportSelection = (exportId: string) => {
    setSelectedExports(prev => 
      prev.includes(exportId) 
        ? prev.filter(id => id !== exportId)
        : [...prev, exportId]
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFilteredData = (data: any[]) => {
    if (!data || dateRange === 'all') return data;

    const cutoffDate = subDays(new Date(), parseInt(dateRange));
    return data.filter(item => new Date(item.created_at) >= cutoffDate);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (selectedExports.length === 0) return;

    setIsExporting(true);

    try {
      for (const exportId of selectedExports) {
        const option = exportOptions.find(opt => opt.id === exportId);
        if (!option) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any[] = [];
        let filename = '';

        switch (option.dataType) {
          case 'leads':
            data = getFilteredData(leads || []);
            filename = `leads_export_${format(new Date(), 'yyyy-MM-dd')}`;
            break;
          case 'tasks':
            data = getFilteredData(tasks || []);
            filename = `tasks_export_${format(new Date(), 'yyyy-MM-dd')}`;
            break;
          case 'users':
            data = users || [];
            filename = `users_export_${format(new Date(), 'yyyy-MM-dd')}`;
            break;
          case 'activities':
            data = []; // Would come from activities API
            filename = `activities_export_${format(new Date(), 'yyyy-MM-dd')}`;
            break;
        }

        if (data.length === 0) continue;

        switch (exportFormat) {
          case 'csv': {
            const csvContent = convertToCSV(data);
            downloadFile(csvContent, `${filename}.csv`, 'text/csv');
            break;
          }
          case 'json': {
            const jsonContent = JSON.stringify(data, null, 2);
            downloadFile(jsonContent, `${filename}.json`, 'application/json');
            break;
          }
          case 'xlsx':
            // In a real implementation, you'd use a library like xlsx
            console.log('XLSX export would be implemented with a library like SheetJS');
            break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return FileSpreadsheet;
      case 'json':
        return FileText;
      case 'xlsx':
        return FileSpreadsheet;
      default:
        return Database;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Data Export</h2>
        <p className="text-[var(--color-text-secondary)]">
          Export system data for backup, analysis, or migration purposes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Select Data to Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedExports.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                    onClick={() => toggleExportSelection(option.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${
                        isSelected 
                          ? 'bg-[var(--color-primary)] text-white' 
                          : 'bg-[var(--color-surface)]'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)]">
                          {option.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          {option.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Formats:
                          </span>
                          {option.formats.map((format) => {
                            const FormatIcon = getFormatIcon(format);
                            return (
                              <div
                                key={format}
                                className="flex items-center gap-1 px-2 py-1 bg-[var(--color-surface)] rounded text-xs"
                              >
                                <FormatIcon className="h-3 w-3" />
                                {format.toUpperCase()}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                          : 'border-[var(--color-border)]'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Export Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  <FileSpreadsheet className="h-4 w-4 inline mr-1" />
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json' | 'xlsx')}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
                >
                  <option value="csv">CSV (Comma Separated)</option>
                  <option value="json">JSON (JavaScript Object)</option>
                  <option value="xlsx">XLSX (Excel Spreadsheet)</option>
                </select>
              </div>

              {/* Export Summary */}
              {selectedExports.length > 0 && (
                <div className="p-3 bg-[var(--color-surface)] rounded border">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">
                    Export Summary
                  </h4>
                  <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                    <div>Selected: {selectedExports.length} dataset(s)</div>
                    <div>Format: {exportFormat.toUpperCase()}</div>
                    <div>Range: {dateRangeOptions.find(opt => opt.value === dateRange)?.label}</div>
                  </div>
                </div>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={selectedExports.length === 0 || isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Export Guidelines */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Export Guidelines
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Large datasets may take time to process</li>
                <li>• CSV format is best for spreadsheet applications</li>
                <li>• JSON format preserves data structure</li>
                <li>• Exported data includes all visible fields</li>
                <li>• Sensitive data is included - handle securely</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
