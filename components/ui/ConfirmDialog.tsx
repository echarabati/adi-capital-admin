'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog closes */
  onClose: () => void;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Variant for styling */
  variant?: 'danger' | 'warning' | 'default';
  /** Loading state for confirm button */
  isLoading?: boolean;
}

const variantStyles = {
  danger: {
    icon: 'bg-error/20 text-error',
    button: 'bg-error text-error-foreground hover:bg-error/90',
  },
  warning: {
    icon: 'bg-warning/20 text-warning',
    button: 'bg-warning text-warning-foreground hover:bg-warning/90',
  },
  default: {
    icon: 'bg-primary/20 text-primary',
    button: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  },
};

/**
 * Confirmation dialog for destructive actions
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Dialog */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-card w-full max-w-md rounded-xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn('shrink-0 rounded-full p-3', styles.icon)}>
                  <AlertTriangle className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <Dialog.Title className="text-card-foreground text-lg font-semibold">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <Dialog.Description className="text-muted-foreground mt-2 text-sm">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
                    styles.button
                  )}
                >
                  {isLoading ? 'Cargando...' : confirmText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
