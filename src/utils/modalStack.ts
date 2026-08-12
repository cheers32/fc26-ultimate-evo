import { useEffect, useRef } from 'react';

/**
 * Which modals are on screen, innermost last.
 *
 * Every modal used to listen for Escape on its own, so one press closed the whole stack: opening
 * an evo's details from inside the builder and pressing Escape shut both, and the builder worked
 * around it by looking the details modal up in the DOM by id. Registering here instead means one
 * press closes one modal — the last one opened — and the check is the same for all of them.
 *
 * Order is mount order. A modal opened on top of another mounts later and so sits on top, which is
 * what nesting means in practice. Two modals appearing in the same commit are the exception: React
 * runs the child's effect first, so the outer one would be treated as the top. Nothing opens that
 * way today — a nested modal is always opened by an interaction with the one beneath it.
 */
const stack: object[] = [];

/** Whether any modal is on screen — for page-level shortcuts, which shouldn't fire underneath one. */
export const isModalOpen = () => stack.length > 0;

/**
 * Close this modal on Escape, but only while it is the top one.
 *
 * `isOpen` is for modals that stay mounted while closed; ones that are only rendered when open can
 * pass true. `onClose` is read at keypress time, so it doesn't have to be stable — a new identity
 * each render would otherwise re-register the modal and send it to the top of the stack.
 */
export function useModalEscape(isOpen: boolean, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const token = {};
    stack.push(token);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (stack[stack.length - 1] !== token) return;
      e.preventDefault();
      close.current();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const at = stack.indexOf(token);
      if (at !== -1) stack.splice(at, 1);
    };
  }, [isOpen]);
}
