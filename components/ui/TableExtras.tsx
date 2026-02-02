'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// TableSearch
// ─────────────────────────────────────────────────────────────────────────────

export interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search input for table filtering
 */
export function TableSearch({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
}: TableSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border py-2 pr-10 pl-10 text-sm transition-colors',
          'border-input-border bg-input-bg text-card-foreground',
          'placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableToolbar
// ─────────────────────────────────────────────────────────────────────────────

export interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Toolbar container for table actions (search, filters, buttons)
 */
export function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TablePagination
// ─────────────────────────────────────────────────────────────────────────────

import { Pagination } from './Pagination';

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Show result count text */
  showResultCount?: boolean;
  /** Total items for result count display */
  totalItems?: number;
  /** Page size for result count display */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Always show pagination even with 1 page */
  alwaysShow?: boolean;
  className?: string;
}

/**
 * Table pagination wrapper that uses the base Pagination component
 */
export function TablePagination({
  page,
  totalPages,
  onPageChange,
  showResultCount = true,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  alwaysShow = false,
  className,
}: TablePaginationProps) {
  if (totalPages <= 1 && !onPageSizeChange && !alwaysShow) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems || page * pageSize);

  return (
    <div
      className={cn('flex items-center justify-between px-4 py-3', className)}
      style={{ backgroundColor: 'var(--table-header-bg)' }}
    >
      <div className="flex items-center gap-4">
        {showResultCount && totalItems !== undefined ? (
          <p className="text-muted-foreground text-sm">
            Mostrando {startItem} - {endItem} de {totalItems}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Página {page} de {totalPages}
          </p>
        )}

        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-secondary text-foreground focus:ring-primary rounded-lg border-0 px-2 py-1 text-sm focus:ring-2 focus:outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          siblingCount={1}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableResultCount
// ─────────────────────────────────────────────────────────────────────────────

export interface TableResultCountProps {
  filtered: number;
  total: number;
  className?: string;
}

/**
 * Shows count of filtered results
 */
export function TableResultCount({ filtered, total, className }: TableResultCountProps) {
  if (filtered === total) {
    return (
      <p className={cn('text-muted-foreground text-sm', className)}>
        {total} {total === 1 ? 'resultado' : 'resultados'}
      </p>
    );
  }

  return (
    <p className={cn('text-muted-foreground text-sm', className)}>
      Mostrando {filtered} de {total} resultados
    </p>
  );
}
