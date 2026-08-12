import { RefObject, useEffect, useRef } from 'react';

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

interface ModalOptions {
  onClose: () => void;
  /**
   * The field the modal opens into — its search box, or whatever it exists to be typed in. A modal
   * you reached by typing is one you are still typing into.
   */
  focusRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  /**
   * The key that opens this modal, which inside it puts the caret back in that field — so the key
   * that got you here means the same thing once you have arrived. Only read with `focusRef`.
   */
  focusKey?: string;
}

/**
 * Register a modal: Escape closes it while it is the top one, and its search box takes focus.
 *
 * `isOpen` is for modals that stay mounted while closed; ones that are only rendered when open can
 * pass true. The options are read at keypress time, so they don't have to be stable — a new
 * identity each render would otherwise re-register the modal and send it to the top of the stack.
 */
export function useModal(isOpen: boolean, options: ModalOptions) {
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  useEffect(() => {
    if (!isOpen) return;

    const token = {};
    stack.push(token);
    const isTop = () => stack[stack.length - 1] === token;

    const field = latest.current.focusRef?.current;
    field?.focus();
    field?.select();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTop()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        latest.current.onClose();
        return;
      }

      const { focusKey, focusRef } = latest.current;
      if (!focusKey || !focusRef?.current) return;
      if (e.key.toLowerCase() !== focusKey.toLowerCase()) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Typing the key into the box it would focus should type it, not re-focus.
      const typing = document.activeElement?.tagName;
      if (typing === 'INPUT' || typing === 'TEXTAREA') return;

      e.preventDefault();
      focusRef.current.focus();
      focusRef.current.select();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const at = stack.indexOf(token);
      if (at !== -1) stack.splice(at, 1);
    };
  }, [isOpen]);
}
