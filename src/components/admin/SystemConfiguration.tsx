// src/components/admin/SystemConfiguration.tsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  LEAD_STATUS_OPTIONS, 
  LEAD_SOURCE_OPTIONS, 
  LEAD_PRIORITY_OPTIONS, 
  INDUSTRY_OPTIONS, 
  SUBSCRIPTION_PACKAGE_OPTIONS,
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_CATEGORY_OPTIONS
} from '../../lib/constants';

interface ConfigItem {
  value: string | null;
  label: string;
  color?: string;
}

interface ConfigSection {
  title: string;
  description: string;
  items: ConfigItem[];
  category: string;
}

const SystemConfiguration = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  // const [editingItem, setEditingItem] = useState<string | null>(null); // TODO: Use when implementing inline editing
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');

  const configSections: ConfigSection[] = [
    {
      title: 'Lead Statuses',
      description: 'Configure available lead status options',
      category: 'leads',
      items: LEAD_STATUS_OPTIONS.map(status => ({
        value: status.value,
        label: status.label,
        color: status.color
      }))
    },
    {
      title: 'Lead Sources',
      description: 'Configure lead source options',
      category: 'leads',
      items: LEAD_SOURCE_OPTIONS.map(source => ({
        value: source.value,
        label: source.label
      }))
    },
    {
      title: 'Lead Priorities',
      description: 'Configure lead priority levels',
      category: 'leads',
      items: LEAD_PRIORITY_OPTIONS.map(priority => ({
        value: priority.value,
        label: priority.label,
        color: priority.color
      }))
    },
    {
      title: 'Industries',
      description: 'Configure industry options',
      category: 'general',
      items: INDUSTRY_OPTIONS.map(industry => ({
        value: industry,
        label: industry
      }))
    },
    {
      title: 'Subscription Packages',
      description: 'Configure subscription package options',
      category: 'general',
      items: SUBSCRIPTION_PACKAGE_OPTIONS.map(pkg => ({
        value: pkg,
        label: pkg
      }))
    },
    {
      title: 'Task Statuses',
      description: 'Configure task status options',
      category: 'tasks',
      items: TASK_STATUS_OPTIONS.map(status => ({
        value: status.value,
        label: status.label,
        color: status.color
      }))
    },
    {
      title: 'Task Priorities',
      description: 'Configure task priority levels',
      category: 'tasks',
      items: TASK_PRIORITY_OPTIONS.map(priority => ({
        value: priority.value,
        label: priority.label,
        color: priority.color
      }))
    },
    {
      title: 'Task Categories',
      description: 'Configure task category options',
      category: 'tasks',
      items: TASK_CATEGORY_OPTIONS.map(category => ({
        value: category.value,
        label: category.label
      }))
    }
  ];

  const handleAddItem = (sectionCategory: string) => {
    if (!newItemValue.trim() || !newItemLabel.trim()) return;
    
    // In a real implementation, this would save to the database
    console.log(`Adding item to ${sectionCategory}:`, {
      value: newItemValue,
      label: newItemLabel
    });
    
    setNewItemValue('');
    setNewItemLabel('');
    setEditingSection(null);
  };

  const handleEditItem = (sectionCategory: string, itemValue: string) => {
    // In a real implementation, this would update the database
    console.log(`Editing item in ${sectionCategory}:`, itemValue);
    // setEditingItem(null); // TODO: Implement when adding inline editing
  };

  const handleDeleteItem = (sectionCategory: string, itemValue: string) => {
    // In a real implementation, this would delete from the database
    console.log(`Deleting item from ${sectionCategory}:`, itemValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">System Configuration</h2>
        <p className="text-[var(--color-text-secondary)]">
          Configure system-wide options and dropdown values
        </p>
      </div>

      {/* Warning Notice */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Configuration Changes
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Changes to these configuration options will affect all users and existing data. 
                Please be careful when modifying or deleting items that are currently in use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configSections.map((section) => (
          <Card key={section.category + section.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {section.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection(editingSection === section.category ? null : section.category)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add New Item Form */}
              {editingSection === section.category && (
                <div className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="e.g., new_status"
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        placeholder="e.g., New Status"
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddItem(section.category)}
                        disabled={!newItemValue.trim() || !newItemLabel.trim()}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSection(null);
                          setNewItemValue('');
                          setNewItemLabel('');
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Items */}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center justify-between p-2 rounded hover:bg-[var(--color-surface-hover)] group"
                  >
                    <div className="flex items-center gap-3">
                      {item.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {item.label}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(section.category, item.value || '')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(section.category, item.value || '')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {section.items.length === 0 && (
                <div className="text-center py-4 text-[var(--color-text-muted)]">
                  No items configured
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Changes Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                Development Note
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                This is a preview of the configuration interface. In production, changes would be 
                saved to the database and require proper validation and migration handling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfiguration;
