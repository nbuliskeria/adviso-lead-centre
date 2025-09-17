// src/components/leads/OpportunityEditTabs.tsx
import { FileText, Users, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import DetailsTab from './tabs/DetailsTab';
import ContactsTab from './tabs/ContactsTab';
import TimelineTab from './tabs/TimelineTab';
import type { Database } from '../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface OpportunityEditTabsProps {
  lead: LeadRow;
  leadId: string;
  onClose: () => void;
}

const OpportunityEditTabs = ({ lead, leadId, onClose }: OpportunityEditTabsProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="details" className="h-full overflow-y-auto">
              <DetailsTab 
                lead={lead} 
                leadId={leadId} 
                onClose={onClose} 
              />
            </TabsContent>

            <TabsContent value="contacts" className="h-full overflow-y-auto">
              <ContactsTab lead={lead} />
            </TabsContent>

            <TabsContent value="timeline" className="h-full overflow-y-auto">
              <TimelineTab leadId={leadId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OpportunityEditTabs;
