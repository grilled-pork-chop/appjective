import {
  useQuery,
  useInfiniteQuery,
  type UseQueryResult,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { api } from './api'
import type {
  Plan,
  Objective,
  LiveObjective,
  SubObjective,
  PaginatedResponse,
} from './types'

// Query keys
export const queryKeys = {
  plans: ['plans'] as const,
  plan: (planId: number) => ['plans', planId] as const,
  objectives: (planId: number) => ['plans', planId, 'objectives'] as const,
  objective: (planId: number, objectiveId: number) =>
    ['plans', planId, 'objectives', objectiveId] as const,
  liveObjective: (planId: number) => ['plans', planId, 'live-objective'] as const,
  subObjectives: (objectiveId: number) =>
    ['objectives', objectiveId, 'sub-objectives'] as const,
}

// Hooks
export function usePlans(): UseQueryResult<Plan[], Error> {
  return useQuery({
    queryKey: queryKeys.plans,
    queryFn: () => api.getPlans(),
  })
}

export function usePlan(planId: number): UseQueryResult<Plan, Error> {
  return useQuery({
    queryKey: queryKeys.plan(planId),
    queryFn: () => api.getPlan(planId),
  })
}

export function useObjectives(planId: number): UseQueryResult<Objective[], Error> {
  return useQuery({
    queryKey: queryKeys.objectives(planId),
    queryFn: () => api.getObjectives(planId),
  })
}

export function useObjective(
  planId: number,
  objectiveId: number
): UseQueryResult<Objective, Error> {
  return useQuery({
    queryKey: queryKeys.objective(planId, objectiveId),
    queryFn: () => api.getObjective(planId, objectiveId),
  })
}

export function useLiveObjective(
  planId: number
): UseQueryResult<LiveObjective | null, Error> {
  return useQuery({
    queryKey: queryKeys.liveObjective(planId),
    queryFn: () => api.getLiveObjective(planId),
    refetchInterval: 5000, // Poll every 5 seconds for live objective updates
  })
}

export function useSubObjectives(
  objectiveId: number,
  limit: number = 30
): UseInfiniteQueryResult<PaginatedResponse<SubObjective>, Error> {
  return useInfiniteQuery({
    queryKey: [...queryKeys.subObjectives(objectiveId), limit],
    queryFn: ({ pageParam = 0 }) => api.getSubObjectives(objectiveId, limit, pageParam),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit
      return nextOffset < lastPage.meta.total ? nextOffset : undefined
    },
    initialPageParam: 0,
  })
}
