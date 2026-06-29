import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  title:        string;
  description?: string;        // renders as subtitle under title
  size?:        'sm' | 'md' | 'lg' | 'xl' | 'full';  // default: 'md'
  children:     React.ReactNode;
  footer?:      React.ReactNode;  // action buttons slot
  closeOnOverlay?: boolean;       // default: true
}

const sizeClasses = {
  sm:   'max-w-sm w-full',
  md:   'max-w-md w-full',
  lg:   'max-w-lg w-full',
  xl:   'max-w-2xl w-full',
  full: 'max-w-[95vw] w-full h-[90vh] flex flex-col',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Lock body scroll + Save and restore focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus on the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simple Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/75 backdrop-blur-sm transition-opacity duration-150"
        onClick={handleOverlayClick}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative bg-[--bg-card] border border-[--border] rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(52,211,153,0.07)]
          transform transition-all duration-200 ease-out scale-100 opacity-100
          outline-none overflow-hidden max-h-[90vh] flex flex-col
          ${sizeClasses[size]}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[--border]">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-[--text-primary]">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-xs text-[--text-secondary]">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto text-[--text-primary]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[--border] bg-[#111712]/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
