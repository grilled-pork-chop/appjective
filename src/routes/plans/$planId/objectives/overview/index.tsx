import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLiveObjective, useObjectives } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/plans/$planId/objectives/overview/')({
  component: OverviewIndex,
})

function OverviewIndex() {
  const { planId } = Route.useParams()
  const planIdNum = parseInt(planId, 10)
  const navigate = useNavigate()

  const { data: liveObjective, isLoading: isLoadingLive } = useLiveObjective(planIdNum)
  const { data: objectives, isLoading: isLoadingObjectives } = useObjectives(planIdNum)

  useEffect(() => {
    // If LIVE exists, redirect to it
    if (liveObjective) {
      navigate({
        to: '/plans/$planId/objectives/overview/$objectiveId',
        params: { planId, objectiveId: 'live' },
        replace: true,
      })
      return
    }

    // Otherwise, redirect to the latest objective (first in descending order)
    if (objectives && objectives.length > 0) {
      navigate({
        to: '/plans/$planId/objectives/overview/$objectiveId',
        params: { planId, objectiveId: objectives[0].id.toString() },
        replace: true,
      })
    }
  }, [liveObjective, objectives, planId, navigate])

  // Show loading state while fetching
  if (isLoadingLive || isLoadingObjectives) {
    return (
      <div className="max-w-7xl h-full mx-auto px-8 py-8">
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-32 w-full rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Fallback (shouldn't normally be reached)
  return null
}
