import { createFileRoute, Link } from '@tanstack/react-router'
import { usePlans } from '@/lib/queries'
import { ArrowRight, Folder } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/plans/')({
  component: PlansPage,
})

function PlansPage() {
  const { data: plans, isLoading, error } = usePlans()

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start gap-4 mb-2">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading plans</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Plans</h1>
        <p className="text-muted-foreground">
          Select a plan to view objectives and track progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <Link
            key={plan.id}
            to="/plans/$planId"
            params={{ planId: plan.id.toString() }}
            className="group"
          >
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Folder className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {plan.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Plan #{plan.id}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plan.description && (
                  <CardDescription className="mb-4 line-clamp-2">
                    {plan.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View objectives</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
