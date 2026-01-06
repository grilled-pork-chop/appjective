import { createFileRoute } from '@tanstack/react-router'
import { ObjectiveDetail } from '@/components/ObjectiveDetail'

export const Route = createFileRoute(
  '/plans/$planId/objectives/overview/$objectiveId'
)({
  component: ObjectivePage,
})

function ObjectivePage() {
  const { planId, objectiveId } = Route.useParams()
  const planIdNum = parseInt(planId, 10)
  const objectiveIdValue = objectiveId === 'live' ? 'live' : parseInt(objectiveId, 10)

  return <ObjectiveDetail planId={planIdNum} objectiveId={objectiveIdValue} />
}
