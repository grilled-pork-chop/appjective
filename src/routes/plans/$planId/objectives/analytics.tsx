import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export const Route = createFileRoute('/plans/$planId/objectives/analytics')({
  component: AnalyticsTab,
})

function AnalyticsTab() {
  return (
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <EmptyState
        icon={BarChart3}
        title="Analytics & Metrics"
        description="Analytics, insights, and performance metrics for this plan will appear here."
      />
    </div>
  )
}
