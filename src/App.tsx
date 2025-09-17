import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Tables } from './lib/database.types';

function App() {
  const [leads, setLeads] = useState<Tables<'leads'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .limit(5);

        if (error) throw error;
        setLeads(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adviso Lead Centre
          </h1>
          <p className="text-lg text-gray-600">
            Project initialized successfully! Connected to Supabase.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Leads
          </h2>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading leads...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {leads.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No leads found. Ready to add your first lead!
                </p>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {lead.company_name}
                        </h3>
                        <p className="text-gray-600">
                          Status: <span className="font-medium">{lead.status}</span>
                        </p>
                        <p className="text-gray-600">
                          Source: <span className="font-medium">{lead.lead_source}</span>
                        </p>
                        <p className="text-gray-600">
                          Industry: <span className="font-medium">{lead.industry}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        {lead.potential_mrr && (
                          <p className="text-green-600 font-semibold">
                            ${lead.potential_mrr}/mo
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {lead.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                              lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {lead.priority}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
