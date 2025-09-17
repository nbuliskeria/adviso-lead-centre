// src/hooks/queries/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

const fetchUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: fetchUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes - user data doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook to fetch a single user by ID
const fetchUser = async (id: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Hook to get users formatted for select dropdowns
export const useUsersForSelect = () => {
  const { data: users, ...rest } = useUsers();
  
  const selectOptions = users?.map(user => ({
    value: user.id,
    label: user.display_name || `${user.first_name} ${user.last_name}`.trim() || user.email || 'Unknown User',
    avatar: user.avatar_url,
  })) || [];

  return {
    data: selectOptions,
    ...rest,
  };
};
