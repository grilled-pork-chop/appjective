import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Check, AlertTriangle, X } from 'lucide-react'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ children, ...props }) => (
          <h1
            className="scroll-m-20 text-2xl font-bold tracking-tight mt-8 mb-4 first:mt-0"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2
            className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight mt-8 mb-4 first:mt-0"
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3
            className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-3 first:mt-0"
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4
            className="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2 first:mt-0"
            {...props}
          >
            {children}
          </h4>
        ),
        // Paragraphs
        p: ({ children, ...props }) => {
          // Check if first child is text starting with emoji
          const firstChild = Array.isArray(children) ? children[0] : children
          const isTextNode = typeof firstChild === 'string'

          if (isTextNode && firstChild.startsWith('⚠️')) {
            // Remove emoji from first child and reconstruct children
            const restOfFirstChild = firstChild.replace('⚠️ ', '').replace('⚠️', '')
            const restChildren = Array.isArray(children) ? children.slice(1) : []

            return (
              <div className="flex gap-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 my-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm leading-relaxed">
                  {restOfFirstChild}
                  {restChildren}
                </div>
              </div>
            )
          }

          if (isTextNode && firstChild.startsWith('✅')) {
            const restOfFirstChild = firstChild.replace('✅ ', '').replace('✅', '')
            const restChildren = Array.isArray(children) ? children.slice(1) : []

            return (
              <div className="flex gap-3 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4 my-4">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm leading-relaxed">
                  {restOfFirstChild}
                  {restChildren}
                </div>
              </div>
            )
          }

          return (
            <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
              {children}
            </p>
          )
        },
        // Lists
        ul: ({ children, ...props }) => (
          <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => {
          // Check if first child is text with checkbox
          const firstChild = Array.isArray(children) ? children[0] : children
          const isTextNode = typeof firstChild === 'string'

          // Handle checkboxes
          if (isTextNode && firstChild.startsWith('[ ]')) {
            const restOfFirstChild = firstChild.replace('[ ] ', '').replace('[ ]', '')
            const restChildren = Array.isArray(children) ? children.slice(1) : []

            return (
              <li className="flex items-start gap-2" {...props}>
                <div className="flex h-5 w-5 items-center justify-center rounded border border-muted-foreground/50 mt-0.5">
                  <X className="h-3 w-3 text-muted-foreground/50" />
                </div>
                <span className="flex-1">
                  {restOfFirstChild}
                  {restChildren}
                </span>
              </li>
            )
          }

          if (isTextNode && (firstChild.startsWith('[x]') || firstChild.startsWith('[X]'))) {
            const restOfFirstChild = firstChild.replace(/\[x\] |\[X\] /, '').replace(/\[x\]|\[X\]/, '')
            const restChildren = Array.isArray(children) ? children.slice(1) : []

            return (
              <li className="flex items-start gap-2" {...props}>
                <div className="flex h-5 w-5 items-center justify-center rounded border border-primary bg-primary mt-0.5">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="flex-1">
                  {restOfFirstChild}
                  {restChildren}
                </span>
              </li>
            )
          }

          return <li {...props}>{children}</li>
        },
        // Blockquotes
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="mt-4 border-l-4 border-primary pl-4 italic text-muted-foreground [&>p]:my-2"
            {...props}
          >
            {children}
          </blockquote>
        ),
        // Tables
        table: ({ children, ...props }) => (
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full border-collapse" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-muted/50" {...props}>
            {children}
          </thead>
        ),
        tr: ({ children, ...props }) => (
          <tr className="border-b transition-colors hover:bg-muted/30" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th
            className="h-12 px-4 text-left align-middle font-semibold text-sm [&:has([role=checkbox])]:pr-0"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="p-4 align-middle text-sm [&:has([role=checkbox])]:pr-0" {...props}>
            {children}
          </td>
        ),
        // Code
        code: ({ children, className, ...props }) => {
          const isInline = !className

          if (isInline) {
            return (
              <code
                className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium"
                {...props}
              >
                {children}
              </code>
            )
          }

          return (
            <code
              className="relative block rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto my-4"
              {...props}
            >
              {children}
            </code>
          )
        },
        pre: ({ children, ...props }) => (
          <pre className="overflow-x-auto" {...props}>
            {children}
          </pre>
        ),
        // Links
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),
        // Horizontal rule
        hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
        // Strong/Bold
        strong: ({ children, ...props }) => (
          <strong className="font-semibold" {...props}>
            {children}
          </strong>
        ),
        // Emphasis/Italic
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),
      }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
