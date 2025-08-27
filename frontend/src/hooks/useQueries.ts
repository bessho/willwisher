import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, WillDraft } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetWillDraft() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WillDraft | null>({
    queryKey: ['willDraft'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWillDraft();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveWillDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: WillDraft) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveWillDraft(draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['willDraft'] });
      queryClient.invalidateQueries({ queryKey: ['willDrafts'] });
    },
  });
}

export function useListWillDrafts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WillDraft[]>({
    queryKey: ['willDrafts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listWillDrafts();
    },
    enabled: !!actor && !actorFetching,
  });
}
