// src/components/leads/tabs/ContactsTab.tsx
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import Avatar from '../../ui/Avatar';
import type { Database } from '../../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface ContactsTabProps {
  lead: LeadRow;
}

// Mock contact data for demonstration
const mockContacts = [
  {
    id: '1',
    name: 'John Smith',
    title: 'CEO',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    avatar: null,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'CTO',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    avatar: null,
  },
];

const ContactsTab = ({ lead }: ContactsTabProps) => {
  // In a real implementation, this would fetch contacts from the database
  // For now, we'll show mock data and a note about future implementation
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Contacts
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Key contacts for {lead.company_name}
          </p>
        </div>
        
        {/* Future: Add Contact button */}
        <div className="text-xs text-[var(--color-text-muted)] bg-[var(--color-background-tertiary)] px-3 py-1 rounded-full">
          Coming Soon
        </div>
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {mockContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar
                  name={contact.name}
                  src={contact.avatar || undefined}
                  size="md"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[var(--color-text-primary)]">
                        {contact.name}
                      </h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {contact.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Mail className="h-4 w-4" />
                      <a 
                        href={`mailto:${contact.email}`}
                        className="hover:text-[var(--color-primary)] transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Phone className="h-4 w-4" />
                      <a 
                        href={`tel:${contact.phone}`}
                        className="hover:text-[var(--color-primary)] transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <MapPin className="h-4 w-4" />
                      <span>{contact.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State / Future Implementation Note */}
      <div className="mt-8 text-center py-8 border-2 border-dashed border-[var(--color-border)] rounded-lg">
        <Users className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          Contact Management
        </h4>
        <p className="text-[var(--color-text-secondary)] mb-4 max-w-md mx-auto">
          Full contact management features including adding, editing, and organizing contacts 
          will be implemented in a future phase.
        </p>
        <div className="text-xs text-[var(--color-text-muted)]">
          Phase 7: Contact Management Module
        </div>
      </div>
    </div>
  );
};

export default ContactsTab;
