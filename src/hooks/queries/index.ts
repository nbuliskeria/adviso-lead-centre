// src/hooks/queries/index.ts
// Export all query hooks for easy importing

// Leads
export { useLeads, useLead } from './useLeads';
export { useUpdateLead, useCreateLead, useDeleteLead } from './useUpdateLead';

// Clients
// Client-related hooks
export * from './useClients';
export * from './useConvertLeadToClient';

// Tasks
export { useTasks, useTasksByLead, useTask } from './useTasks';
export { useUpdateTask, useCreateTask, useDeleteTask } from './useUpdateTask';

// Task Templates
export * from './useTaskTemplates';

// Task Mutations
export * from './useTaskMutations';

// Users
export { useUsers, useUser, useUsersForSelect } from './useUsers';

// Activities
export { useActivities, useActivitiesByLead, useCreateActivity } from './useActivities';
