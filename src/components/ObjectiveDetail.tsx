import { useState, useEffect, useRef } from 'react'
import { useObjective, useLiveObjective, useSubObjectives } from '@/lib/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, Flag, Hash, ListTree } from 'lucide-react'
import { Markdown } from '@/components/markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useScrollToSection } from '@/hooks/useScrollToSection'
import { useActiveSection } from '@/hooks/useActiveSection'
import type {
  ObjectiveDetailProps,
  ContentSectionProps,
  NavButtonProps,
  SubObjective,
  SubObjectivesInfiniteData,
} from '@/lib/types'
import { SECTION_IDS } from '@/lib/types'

const PAGE_SIZE = 15

export function ObjectiveDetail({ planId, objectiveId }: ObjectiveDetailProps) {
  const isLive = objectiveId === 'live'
  const objectiveIdNum = typeof objectiveId === 'number' ? objectiveId : 0
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: objective, isLoading: isLoadingObjective } = useObjective(
    planId,
    objectiveIdNum
  )
  const { data: liveObjective, isLoading: isLoadingLive } = useLiveObjective(planId)
  const {
    data: subObjectivesData,
    isLoading: isLoadingSubObjectives,
    fetchNextPage,
    hasNextPage,
  } = useSubObjectives(objectiveIdNum, PAGE_SIZE)

  const data = isLive ? liveObjective : objective
  const isLoading = isLive ? isLoadingLive : isLoadingObjective

  const scrollToSection = useScrollToSection(scrollContainerRef)
  const activeSection = useActiveSection(scrollContainerRef, [...SECTION_IDS], !isLoading)

  useEffect(() => {
    setCurrentPage(0)
  }, [objectiveIdNum])

  useEffect(() => {
    const infiniteData = subObjectivesData as SubObjectivesInfiniteData | undefined
    const pages = infiniteData?.pages || []
    if (currentPage > 0 && currentPage >= pages.length && hasNextPage) {
      fetchNextPage()
    }
  }, [currentPage, subObjectivesData, hasNextPage, fetchNextPage])

  const infiniteData = subObjectivesData as SubObjectivesInfiniteData | undefined
  const currentPageData = infiniteData?.pages?.[currentPage]
  const totalPages = currentPageData
    ? Math.ceil(currentPageData.meta.total / PAGE_SIZE)
    : 0

  if (isLoading) {
    return (
      <ScrollArea className="max-w-7xl h-full mx-auto px-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-44 shrink-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 mb-4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>

          <main className="flex-1 space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full rounded-3xl" />
              </div>
            ))}
          </main>
        </div>
      </ScrollArea>
    )
  }

  if (!data) return null

  return (
    <ScrollArea ref={scrollContainerRef} className="max-w-7xl h-full mx-auto px-8">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight flex-1 min-w-0">
            {data.title}
          </h1>

          {isLive ? (
            <Badge
              variant="destructive"
              className="rounded-full px-4 py-1.5 animate-pulse shadow-lg shadow-destructive/20 shrink-0"
            >
              Live Objective
            </Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full px-3 py-1.5 shrink-0">
              <Hash className="h-3 w-3 mr-1.5" />
              {data.counter}
            </Badge>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Sticky Sidebar */}
        <aside className="w-44 shrink-0">
          <div className="sticky top-24">
            <nav className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Jump To
              </p>
              <Separator className="mb-2" />
              <NavButton
                icon={<FileText className="h-4 w-4" />}
                label="Task"
                onClick={() => scrollToSection('task')}
                active={activeSection === 'task'}
              />
              <NavButton
                icon={<Flag className="h-4 w-4" />}
                label="Result"
                onClick={() => scrollToSection('result')}
                active={activeSection === 'result'}
              />
              <NavButton
                icon={<ListTree className="h-4 w-4" />}
                label="Execution"
                onClick={() => scrollToSection('log')}
                active={activeSection === 'log'}
              />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12 min-w-0">
          <ContentSection
            id="task"
            title="Task Requirement"
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            content={data.task}
          />

          <ContentSection
            id="result"
            title="Final Result"
            icon={<Flag className="h-5 w-5 text-emerald-500" />}
            content={data.result}
          />

          {/* Execution Log */}
          <section id="log" className="scroll-mt-4 space-y-6">
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg border">
                    <ListTree className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Execution Log</h2>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="rounded-2xl border">
                <Table className="min-w-full border-collapse md:table-auto rounded-t-lg">
                  <TableHeader className="bg-muted/50 rounded-t-lg">
                    <TableRow>
                      <TableHead className="w-[80px] font-bold text-[10px] uppercase tracking-widest rounded-tl-lg">
                        Step
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest">
                        Instruction
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest rounded-tr-lg">
                        Response
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingSubObjectives ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                          Syncing steps...
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData?.data.map((subObj: SubObjective) => (
                        <TableRow
                          key={subObj.id}
                          className="group hover:shadow-md transition-shadow border-b rounded-lg md:table-row block mb-4 md:mb-0"
                        >
                          {/* Step */}
                          <TableCell className="align-top py-4 font-mono text-[10px] text-muted-foreground/40 group-hover:text-primary transition-colors md:table-cell block">
                            #{subObj.id}
                          </TableCell>

                          {/* Instruction */}
                          <TableCell className="align-top py-4 text-sm font-semibold leading-relaxed md:table-cell block">
                            <span className="font-medium text-muted-foreground/60 md:hidden">Instruction: </span>
                            {subObj.input}
                          </TableCell>

                          {/* Response */}
                          <TableCell className="align-top py-4 text-sm text-muted-foreground/80 italic leading-relaxed md:table-cell block">
                            <span className="font-medium text-muted-foreground/60 md:hidden">Response: </span>
                            {subObj.output}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t mt-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Page {currentPage + 1} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={currentPage >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}</div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </ScrollArea>
  )
}

function ContentSection({ id, title, icon, content }: ContentSectionProps) {
  return (
    <section id={id} className="scroll-mt-4 space-y-6">
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg border">{icon}</div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed">
            {content ? (
              <Markdown>{content}</Markdown>
            ) : (
              <span className="text-muted-foreground italic">No data available yet.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function NavButton({ icon, label, onClick, active }: NavButtonProps) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className="w-full justify-start gap-3 text-sm font-medium"
      onClick={onClick}
    >
      <span className={active ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>
      <span>{label}</span>
    </Button>
  )
}
