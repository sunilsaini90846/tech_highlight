import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: URLSearchParams
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
  className = ''
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2 // Number of pages to show on each side of current page

    // Always show first page
    if (1 < currentPage - delta) {
      pages.push(1)
      if (2 < currentPage - delta) {
        pages.push('...')
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i)
    }

    // Always show last page
    if (totalPages > currentPage + delta) {
      if (totalPages - 1 > currentPage + delta) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Pagination">
      <div className="flex justify-between flex-1 sm:hidden">
        {/* Mobile pagination */}
        {currentPage > 1 && (
          <Link
            href={buildUrl(currentPage - 1)}
            className="btn btn-secondary"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={buildUrl(currentPage + 1)}
            className="btn btn-secondary ml-auto"
          >
            Next
          </Link>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {/* Previous button */}
          {currentPage > 1 ? (
            <Link
              href={buildUrl(currentPage - 1)}
              className="btn btn-secondary p-2"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
          ) : (
            <span className="btn btn-secondary p-2 opacity-50 cursor-not-allowed">
              <ChevronLeftIcon className="h-4 w-4" />
            </span>
          )}

          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-neutral-500"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isCurrentPage = pageNum === currentPage

            return (
              <Link
                key={pageNum}
                href={buildUrl(pageNum)}
                className={`btn ${
                  isCurrentPage
                    ? 'btn-primary'
                    : 'btn-secondary'
                } px-3 py-2`}
                aria-label={`Page ${pageNum}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            )
          })}

          {/* Next button */}
          {currentPage < totalPages ? (
            <Link
              href={buildUrl(currentPage + 1)}
              className="btn btn-secondary p-2"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          ) : (
            <span className="btn btn-secondary p-2 opacity-50 cursor-not-allowed">
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}

