// ===========================
// Domain Models
// ===========================

export interface Plan {
  id: number
  title: string
  description?: string
}

export interface Objective {
  id: number
  counter: number
  title: string
  task?: string
  result?: string
  contextualData?: string
}

export interface LiveObjective {
  id: string
  counter: number
  title: string
  task?: string
  result?: string
  contextualData?: string
}

export interface SubObjective {
  id: number
  input: string
  output: string
}

// ===========================
// API Response Types
// ===========================

export interface PaginationMeta {
  limit: number
  offset: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ===========================
// Infinite Query Types
// ===========================

export interface InfiniteQueryPage<T> {
  data: T[]
  meta: PaginationMeta
}

export interface InfiniteQueryData<T> {
  pages: InfiniteQueryPage<T>[]
  pageParams: unknown[]
}

// Specific type for sub-objectives infinite query
export type SubObjectivesInfiniteData = InfiniteQueryData<SubObjective>

// ===========================
// Component Props Types
// ===========================

export interface ObjectiveDetailProps {
  planId: number
  objectiveId: number | 'live'
}

export interface ObjectiveTOCProps {
  planId: number
}

export interface ContentSectionProps {
  id: string
  title: string
  icon: React.ReactNode
  content?: string
}

export interface NavButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}

// ===========================
// Route Params Types
// ===========================

export type TabValue = 'overview' | 'activity' | 'analytics'

export interface PlanRouteParams {
  planId: string
}

export interface ObjectiveRouteParams extends PlanRouteParams {
  objectiveId: string
}

// ===========================
// Utility Types
// ===========================

export type ObjectiveOrLive = Objective | LiveObjective

// Type guard to check if objective is live
export function isLiveObjective(
  objective: ObjectiveOrLive
): objective is LiveObjective {
  return typeof objective.id === 'string' && objective.id === 'live'
}

// ===========================
// Hook Return Types
// ===========================

export interface ScrollToSectionFunction {
  (sectionId: string): void
}

export interface UseActiveSectionReturn {
  activeSection: string
}

// ===========================
// Constants
// ===========================

export const SECTION_IDS = ['task', 'result', 'log'] as const
export type SectionId = typeof SECTION_IDS[number]
