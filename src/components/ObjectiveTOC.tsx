import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useObjectives, useLiveObjective } from '@/lib/queries'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ObjectiveTOCProps {
  planId: number
  onNavigate?: () => void
}

const DEBOUNCE_DELAY = 300
const ITEM_SIZE = 32
const OVERSCAN = 10
const SCROLL_DELAY = 100
const NEAR_END_THRESHOLD = 3

export function ObjectiveTOC({ planId, onNavigate }: ObjectiveTOCProps) {
  const params = useParams({ strict: false })
  const currentObjectiveId = params.objectiveId
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const parentRef = useRef<HTMLDivElement>(null)
  const previousObjectiveIdRef = useRef<string | undefined>(undefined)

  const { data: objectives = [], isLoading } = useObjectives(planId)
  const { data: liveObjective } = useLiveObjective(planId)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), DEBOUNCE_DELAY)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredObjectives = useMemo(() => {
    if (!debouncedQuery) return objectives

    const query = debouncedQuery.toLowerCase()
    return objectives.filter(
      (obj) =>
        obj.counter.toString().includes(query) ||
        obj.title.toLowerCase().includes(query)
    )
  }, [objectives, debouncedQuery])

  const virtualizer = useVirtualizer({
    count: filteredObjectives.length,
    getScrollElement: () =>
      parentRef.current?.querySelector('[data-radix-scroll-area-viewport]') ?? null,
    estimateSize: () => ITEM_SIZE,
    overscan: OVERSCAN,
  })

  useEffect(() => {
    if (!currentObjectiveId || currentObjectiveId === 'live' || filteredObjectives.length === 0) {
      return
    }

    const isNavigating =
      previousObjectiveIdRef.current !== undefined &&
      previousObjectiveIdRef.current !== currentObjectiveId

    if (isNavigating) {
      previousObjectiveIdRef.current = currentObjectiveId
      return
    }

    if (previousObjectiveIdRef.current === undefined) {
      const selectedIndex = filteredObjectives.findIndex(
        (obj) =>
          currentObjectiveId === obj.id.toString() ||
          parseInt(currentObjectiveId, 10) === obj.id
      )

      if (selectedIndex !== -1) {
        const timer = setTimeout(() => {
          const isNearEnd = selectedIndex >= filteredObjectives.length - NEAR_END_THRESHOLD
          virtualizer.scrollToIndex(selectedIndex, {
            align: isNearEnd ? 'end' : 'center',
            behavior: 'smooth',
          })
          previousObjectiveIdRef.current = currentObjectiveId
        }, SCROLL_DELAY)

        return () => clearTimeout(timer)
      }

      previousObjectiveIdRef.current = currentObjectiveId
    }
  }, [currentObjectiveId, filteredObjectives, virtualizer])

  const isObjectiveSelected = (objectiveId: number) =>
    currentObjectiveId === objectiveId.toString() ||
    parseInt(currentObjectiveId || '0', 10) === objectiveId

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-muted/30">
        <div className="p-2 md:p-4 border-b bg-background">
          <Skeleton className="h-8 md:h-9 w-full" />
        </div>
        <div className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-8 md:h-9 w-full" />
          ))}
        </div>
        <div className="px-3 py-2 md:px-6 md:py-3 border-t bg-background">
          <Skeleton className="h-3 md:h-4 w-20 md:w-24 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Live Objective - always visible */}
      {liveObjective && (
        <div className="sticky top-0 z-10 border-b bg-background">
          <Link
            to="/plans/$planId/objectives/overview/$objectiveId"
            params={{ planId: planId.toString(), objectiveId: 'live' }}
            onClick={onNavigate}
            className={cn(
              'block px-3 py-2 md:px-6 md:py-4 hover:bg-accent/50 transition-all duration-200',
              currentObjectiveId === 'live' && 'bg-accent'
            )}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-red-500/10">
                <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-red-500" />
                </span>
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Live
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Search Input */}
      <div className="p-2 md:p-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-2 md:left-3 top-2 md:top-2.5 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 md:pl-9 h-8 md:h-9 text-sm"
          />
        </div>
      </div>

      {/* Virtualized List */}
      <ScrollArea ref={parentRef} className="flex-1 h-full overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const objective = filteredObjectives[virtualItem.index]
            const isSelected = isObjectiveSelected(objective.id)

            return (
              <Link
                key={objective.id}
                to="/plans/$planId/objectives/overview/$objectiveId"
                params={{
                  planId: planId.toString(),
                  objectiveId: objective.id.toString(),
                }}
                onClick={onNavigate}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className={cn(
                  'flex items-center gap-2 md:gap-3 px-3 py-2 md:px-6 md:py-2.5 text-xs md:text-sm hover:bg-accent/50 transition-all duration-150 border-l-2 md:border-l-4 border-transparent',
                  isSelected
                    ? 'bg-accent border-l-primary font-medium'
                    : 'hover:border-l-muted-foreground/20'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] md:text-xs font-mono tabular-nums shrink-0 w-8 md:w-12',
                    isSelected ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}
                >
                  #{objective.counter}
                </span>
                <span className="truncate leading-tight">{objective.title}</span>
              </Link>
            )
          })}
        </div>

        {filteredObjectives.length === 0 && (
          <div className="px-3 py-6 md:px-4 md:py-8 text-center text-xs md:text-sm text-muted-foreground">
            No objectives found
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-2 md:px-6 md:py-3 border-t bg-background">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground text-center">
          {filteredObjectives.length} objective{filteredObjectives.length !== 1 ? 's' : ''}
          {debouncedQuery && ' found'}
        </p>
      </div>
    </div>
  )
}
