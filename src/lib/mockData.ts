// src/lib/mockData.ts
// Mock data initialization for testing without database

export const initializeMockData = () => {
  // Initialize mock leads if none exist
  if (!localStorage.getItem('mockLeads')) {
    const mockLeads = [
      {
        id: 'lead-1',
        company_name: 'Acme Corporation',
        industry: 'Technology',
        lead_source: 'Website',
        status: 'New Lead',
        priority: 'high',
        potential_mrr: 2500,
        subscription_package: 'Professional',
        lead_owner_id: 'mock-user',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        lead_owner_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        }
      },
      {
        id: 'lead-2',
        company_name: 'Global Solutions Inc',
        industry: 'Consulting',
        lead_source: 'Referral',
        status: 'Qualified',
        priority: 'medium',
        potential_mrr: 5000,
        subscription_package: 'Enterprise',
        lead_owner_id: 'mock-user',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        lead_owner_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        }
      },
      {
        id: 'lead-3',
        company_name: 'StartupXYZ',
        industry: 'SaaS',
        lead_source: 'LinkedIn',
        status: 'Won',
        priority: 'high',
        potential_mrr: 1200,
        subscription_package: 'Starter',
        lead_owner_id: 'mock-user',
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updated_at: new Date(Date.now() - 86400000).toISOString(), // Updated 1 day ago
        lead_owner_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        }
      }
    ];
    localStorage.setItem('mockLeads', JSON.stringify(mockLeads));
  }

  // Initialize mock tasks if none exist
  if (!localStorage.getItem('mockTasks')) {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Follow up with Acme Corporation',
        description: 'Send proposal and schedule demo',
        status: 'pending',
        priority: 'high',
        category: 'sales',
        assignee_id: 'mock-user',
        lead_id: 'lead-1',
        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        assignee_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        },
        lead: {
          id: 'lead-1',
          company_name: 'Acme Corporation'
        }
      },
      {
        id: 'task-2',
        title: 'Prepare contract for Global Solutions',
        description: 'Draft enterprise contract with custom terms',
        status: 'in_progress',
        priority: 'medium',
        category: 'legal',
        assignee_id: 'mock-user',
        lead_id: 'lead-2',
        due_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        assignee_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        },
        lead: {
          id: 'lead-2',
          company_name: 'Global Solutions Inc'
        }
      },
      {
        id: 'task-3',
        title: 'Onboard StartupXYZ',
        description: 'Set up account and initial configuration',
        status: 'completed',
        priority: 'high',
        category: 'onboarding',
        assignee_id: 'mock-user',
        lead_id: 'lead-3',
        due_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (completed)
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        assignee_profile: {
          id: 'mock-user',
          first_name: 'Demo',
          last_name: 'User',
          display_name: 'Demo User',
          avatar_url: null,
        },
        lead: {
          id: 'lead-3',
          company_name: 'StartupXYZ'
        }
      }
    ];
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
  }

  console.log('Mock data initialized successfully');
};

export const clearMockData = () => {
  localStorage.removeItem('mockLeads');
  localStorage.removeItem('mockTasks');
  localStorage.removeItem('convertedClients');
  console.log('Mock data cleared');
};
