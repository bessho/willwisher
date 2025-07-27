import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WillData, UserProfile, TrustData } from '../backend';
import { Principal } from '@dfinity/principal';

export function useWillQueries() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  // Get all will drafts
  const getAllWillDraftsQuery = useQuery({
    queryKey: ['willDrafts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllWillDrafts();
    },
    enabled: !!actor && !isFetching,
  });

  // Get user profile
  const getUserProfileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });

  // Save will draft mutation
  const saveWillDraftMutation = useMutation({
    mutationFn: async ({ draftId, willData }: { draftId: string; willData: WillData }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveWillDraft(draftId, willData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['willDrafts'] });
    },
  });

  // Delete will draft mutation
  const deleteWillDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteWillDraft(draftId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['willDrafts'] });
    },
  });

  // Save user profile mutation
  const saveUserProfileMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveUserProfile(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  return {
    getAllWillDraftsQuery,
    getUserProfileQuery,
    saveWillDraftMutation,
    deleteWillDraftMutation,
    saveUserProfileMutation,
  };
}

export function useTrustQueries() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  // Get all trust drafts
  const getAllTrustDraftsQuery = useQuery({
    queryKey: ['trustDrafts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTrustDrafts();
    },
    enabled: !!actor && !isFetching,
  });

  // Save trust draft mutation
  const saveTrustDraftMutation = useMutation({
    mutationFn: async ({ draftId, trustData }: { draftId: string; trustData: TrustData }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTrustDraft(draftId, trustData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustDrafts'] });
    },
  });

  // Delete trust draft mutation
  const deleteTrustDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTrustDraft(draftId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustDrafts'] });
    },
  });

  return {
    getAllTrustDraftsQuery,
    saveTrustDraftMutation,
    deleteTrustDraftMutation,
  };
}

// Custom hook for getting a specific will draft
export function useWillDraft(draftId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['willDraft', draftId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWillDraft(draftId);
    },
    enabled: !!actor && !isFetching && !!draftId,
  });
}

// User profile hook
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// Save user profile hook
export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: { name: string; email: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.saveUserProfile(profile.name, profile.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

// User approval status hook - automatically approved for all users
export function useUserApprovalStatus() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['userApprovalStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('No actor available');
      // All users are automatically approved
      return { approved: {} as Record<string, never> };
    },
    enabled: !!actor && !isFetching,
  });
}

// Check if current user is admin - for now, return true for the first user (admin)
export function useIsCurrentUserAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['isCurrentUserAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      // For now, we'll consider the first user as admin
      // This is a simplified implementation since the backend doesn't have full multi-user system yet
      return true; // Enable admin features for demonstration
    },
    enabled: !!actor && !isFetching,
  });
}

// List all users - simplified mock implementation
export function useListUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['listUsers'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock user data for demonstration
      // In a real implementation, this would come from the backend
      return [
        {
          principal: { toString: () => 'rdmx6-jaaaa-aaaah-qcaiq-cai' },
          role: { user: {} as Record<string, never> },
          approval: { approved: {} as Record<string, never> }
        },
        {
          principal: { toString: () => 'rrkah-fqaaa-aaaah-qcaiq-cai' },
          role: { admin: {} as Record<string, never> },
          approval: { approved: {} as Record<string, never> }
        }
      ];
    },
    enabled: !!actor && !isFetching,
  });
}

// Set user approval status - mock implementation
export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ user, approval }: { user: string, approval: 'approved' | 'rejected' }) => {
      if (!actor) throw new Error('No actor');
      // Mock implementation - in reality this would call backend
      console.log(`Setting approval for ${user} to ${approval}`);
      return { ok: null };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listUsers'] });
    },
  });
}

// Assign user role - mock implementation
export function useAssignRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ user, role }: { user: string, role: 'admin' | 'user' | 'guest' }) => {
      if (!actor) throw new Error('No actor');
      // Mock implementation - in reality this would call backend
      console.log(`Assigning role ${role} to ${user}`);
      return { ok: null };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listUsers'] });
    },
  });
}
