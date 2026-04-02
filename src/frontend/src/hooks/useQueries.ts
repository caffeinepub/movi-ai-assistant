import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatSession, SessionMessage, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useGetSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatSession[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionMessages(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SessionMessage[]>({
    queryKey: ["session-messages", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getSessionMessages(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useGetStarters() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["starters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStarters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApiKey() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["api-key"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getApiKey();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useSetApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-key"] });
    },
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
