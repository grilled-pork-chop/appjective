import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/plans/$planId')({
  component: () => <Outlet />,
})
