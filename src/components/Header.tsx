import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M10 18C10 21.3137 12.6863 24 16 24C19.3137 24 22 21.3137 22 18V8" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      <circle cx="22" cy="8" r="3" className="fill-primary" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-full w-full items-center justify-between px-8">
        <Link to="/plans" className="flex items-center gap-2 font-semibold">
          {/* Custom SVG Logo */}
          <Logo className="h-7 w-7 text-foreground" />
          <span className="text-xl">AppJective</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
