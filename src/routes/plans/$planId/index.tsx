import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/plans/$planId/')({
  component: () => {
    const { planId } = Route.useParams()
    return <Navigate to="/plans/$planId/objectives/overview" params={{ planId }} />
  },
})
