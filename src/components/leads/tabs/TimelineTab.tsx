// src/components/leads/tabs/TimelineTab.tsx
import { useState } from 'react';
import { Clock, MessageSquare, Phone, Mail, Calendar, Plus, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Label } from '../../ui/Label';
import Avatar from '../../ui/Avatar';
import { useCreateActivity } from '../../../hooks/queries/useActivities';
import { useToast } from '../../../hooks/useToast';

interface TimelineTabProps {
  leadId: string;
}

// Mock activity data for demonstration
const mockActivities = [
  {
    id: '1',
    type: 'note',
    notes: 'Initial discovery call completed. Client is interested in our premium package.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    owner: {
      name: 'John Doe',
      avatar: null,
    },
  },
  {
    id: '2',
    type: 'email',
    notes: 'Sent proposal and pricing information via email.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    owner: {
      name: 'Sarah Wilson',
      avatar: null,
    },
  },
  {
    id: '3',
    type: 'call',
    notes: 'Follow-up call scheduled for next Tuesday at 2 PM.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    owner: {
      name: 'Mike Johnson',
      avatar: null,
    },
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <Phone className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'meeting':
      return <Calendar className="h-4 w-4" />;
    case 'note':
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'call':
      return 'text-[var(--color-info)] bg-[var(--color-info-light)]';
    case 'email':
      return 'text-[var(--color-warning)] bg-[var(--color-warning-light)]';
    case 'meeting':
      return 'text-[var(--color-success)] bg-[var(--color-success-light)]';
    case 'note':
    default:
      return 'text-[var(--color-primary)] bg-[var(--color-primary-light)]';
  }
};

const TimelineTab = ({ leadId }: TimelineTabProps) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const { addToast } = useToast();
  const createActivityMutation = useCreateActivity();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await createActivityMutation.mutateAsync({
        lead_id: leadId,
        type: 'note',
        notes: newNote.trim(),
      });

      setNewNote('');
      setIsAddingNote(false);
      addToast('Note added successfully!', 'success');
    } catch {
      addToast('Failed to add note. Please try again.', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Activity Timeline
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Track all interactions and updates
          </p>
        </div>
        
        <Button
          onClick={() => setIsAddingNote(!isAddingNote)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Label htmlFor="new-note">Add Activity Note</Label>
              <textarea
                id="new-note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note or activity details..."
                className="w-full min-h-[100px] p-3 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] resize-none"
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || createActivityMutation.isPending}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {createActivityMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Add Note
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full
                ${getActivityColor(activity.type)}
              `}>
                {getActivityIcon(activity.type)}
              </div>
              {index < mockActivities.length - 1 && (
                <div className="w-0.5 h-8 bg-[var(--color-border)] mt-2" />
              )}
            </div>

            {/* Activity Content */}
            <div className="flex-1 pb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={activity.owner.name}
                        src={activity.owner.avatar || undefined}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {activity.owner.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] capitalize">
                          {activity.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Clock className="h-3 w-3" />
                      {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  
                  <p className="text-[var(--color-text-secondary)]">
                    {activity.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockActivities.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            No Activities Yet
          </h4>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Start tracking interactions by adding your first note.
          </p>
          <Button
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Note
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimelineTab;
