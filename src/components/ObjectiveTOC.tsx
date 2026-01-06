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
}

const DEBOUNCE_DELAY = 300
const VIRTUALIZED_ITEM_SIZE = 36
const VIRTUALIZED_OVERSCAN = 10

export function ObjectiveTOC({ planId }: ObjectiveTOCProps) {
  const params = useParams({ strict: false })
  const currentObjectiveId = params.objectiveId
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const parentRef = useRef<HTMLDivElement>(null)

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
    estimateSize: () => VIRTUALIZED_ITEM_SIZE,
    overscan: VIRTUALIZED_OVERSCAN,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-muted/30">
        <div className="p-4 border-b bg-background">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
        <div className="px-6 py-3 border-t bg-background">
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {liveObjective && !debouncedQuery && (
        <div className="sticky top-0 z-10 border-b bg-background">
          <Link
            to="/plans/$planId/objectives/overview/$objectiveId"
            params={{ planId: planId.toString(), objectiveId: 'live' }}
            className={cn(
              'block px-6 py-4 hover:bg-accent/50 transition-all duration-200',
              currentObjectiveId === 'live' ? 'bg-accent' : ''
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Live
                  </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="p-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

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
            const isSelected =
              currentObjectiveId === objective.id.toString() ||
              parseInt(currentObjectiveId || '0', 10) === objective.id

            return (
              <Link
                key={objective.id}
                to="/plans/$planId/objectives/overview/$objectiveId"
                params={{
                  planId: planId.toString(),
                  objectiveId: objective.id.toString(),
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className={cn(
                  'flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-accent/50 transition-all duration-150 border-l-4 border-transparent',
                  isSelected
                    ? 'bg-accent border-l-primary font-medium'
                    : 'hover:border-l-muted-foreground/20'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-mono tabular-nums shrink-0 w-12',
                    isSelected ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}
                >
                  #{objective.counter}
                </span>
                <span className="truncate">{objective.title}</span>
              </Link>
            )
          })}
        </div>

        {filteredObjectives.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No objectives found
          </div>
        )}
      </ScrollArea>

      <div className="px-6 py-3 border-t bg-background">
        <div className="text-xs font-medium text-muted-foreground text-center">
          {filteredObjectives.length} objective{filteredObjectives.length !== 1 ? 's' : ''}
          {debouncedQuery && ' found'}
        </div>
      </div>
    </div>
  )
}
