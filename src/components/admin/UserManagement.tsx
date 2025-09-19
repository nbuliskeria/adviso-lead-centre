// src/components/admin/UserManagement.tsx
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  UserX, 
  UserCheck, 
  Shield, 
  Mail, 
  Phone,
  Building,
  Calendar,
  // MoreHorizontal // TODO: Use for user actions menu
} from 'lucide-react';
import { useUsers } from '../../hooks/queries/useUsers';
import { useUpdateUser, useDeactivateUser, useReactivateUser } from '../../hooks/queries/useUserMutations';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface UserManagementProps {
  onCreateUser?: () => void;
  onEditUser?: (userId: string) => void;
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
};

const roleIcons = {
  admin: Shield,
  manager: Shield,
  user: Shield,
};

const UserManagement = ({ onCreateUser, onEditUser }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: users, isLoading, error } = useUsers();
  const updateUserMutation = useUpdateUser();
  const deactivateUserMutation = useDeactivateUser();
  const reactivateUserMutation = useReactivateUser();

  // Filter users based on search and filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.is_active) ||
      (selectedStatus === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'user') => {
    await updateUserMutation.mutateAsync({
      id: userId,
      updates: { role: newRole }
    });
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    if (isActive) {
      await deactivateUserMutation.mutateAsync(userId);
    } else {
      await reactivateUserMutation.mutateAsync(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading users: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">User Management</h2>
          <p className="text-[var(--color-text-secondary)]">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={onCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border)]">
            {filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
              
              return (
                <div key={user.id} className="p-6 hover:bg-[var(--color-surface-hover)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {user.display_name || `${user.first_name} ${user.last_name}`}
                          </h3>
                          
                          {/* Role Badge */}
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                            roleColors[user.role as keyof typeof roleColors]
                          )}>
                            <RoleIcon className="h-3 w-3" />
                            {user.role}
                          </span>

                          {/* Status Badge */}
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            user.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          )}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          {user.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {user.company}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Role Selector */}
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'manager' | 'user')}
                        disabled={updateUserMutation.isPending}
                        className="px-2 py-1 text-sm border border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>

                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditUser?.(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Toggle Status Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.is_active || false)}
                        disabled={deactivateUserMutation.isPending || reactivateUserMutation.isPending}
                      >
                        {user.is_active ? (
                          <UserX className="h-4 w-4 text-red-600" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-[var(--color-text-muted)]">
                No users found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
