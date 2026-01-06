import { createFileRoute } from '@tanstack/react-router'
import { Activity } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export const Route = createFileRoute('/plans/$planId/objectives/activity')({
  component: ActivityTab,
})

function ActivityTab() {
  return (
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <EmptyState
        icon={Activity}
        title="Activity Timeline"
        description="Activity timeline and history for this plan will appear here."
      />
    </div>
  )
}
