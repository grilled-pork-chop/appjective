import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ObjectiveTOC } from '@/components/ObjectiveTOC'

export const Route = createFileRoute('/plans/$planId/objectives/overview')({
  component: OverviewLayout,
})

function OverviewLayout() {
  const { planId } = Route.useParams()
  const planIdNum = parseInt(planId, 10)

  return (
    <div className="flex h-full">
      {/* Fixed TOC on the left */}
      <aside className="w-80 border-r border-l shrink-0">
        <ObjectiveTOC planId={planIdNum} />
      </aside>
      {/* Main content area */}
      <main className="flex-1 px-4 py-4 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
