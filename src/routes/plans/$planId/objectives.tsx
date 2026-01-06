import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { usePlan } from '@/lib/queries'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { TabValue } from '@/lib/types'

export const Route = createFileRoute('/plans/$planId/objectives')({
  component: ObjectivesLayout,
})

function ObjectivesLayout() {
  const { planId } = Route.useParams()
  const planIdNum = parseInt(planId, 10)
  const { data: plan, isLoading, error } = usePlan(planIdNum)
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<TabValue>('overview')

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('activity')) setCurrentTab('activity')
    else if (path.includes('analytics')) setCurrentTab('analytics')
    else setCurrentTab('overview')
  }, [window.location.pathname])

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
          <div className="px-8 pt-4 pb-4">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="px-8 pb-4">
            <Skeleton className="h-10 w-96" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading plan</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    const tabValue = value as TabValue
    setCurrentTab(tabValue)

    if (tabValue === 'overview') {
      navigate({ to: '/plans/$planId/objectives/overview', params: { planId } })
    } else if (tabValue === 'activity') {
      navigate({ to: '/plans/$planId/objectives/activity', params: { planId } })
    } else {
      navigate({ to: '/plans/$planId/objectives/analytics', params: { planId } })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
        <div className="px-8 pt-4 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">{plan?.title}</h1>
          {plan?.description && (
            <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
          )}
        </div>

        <div className="px-8 pb-4">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
