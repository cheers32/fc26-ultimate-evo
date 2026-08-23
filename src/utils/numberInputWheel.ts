/**
 * Stop the mouse wheel from editing number inputs.
 *
 * A focused `<input type="number">` treats the wheel as its up/down arrows, so scrolling with the
 * cursor over a stat bound silently changes it — the kind of wrong number you only notice through
 * the results it produces, if at all.
 *
 * Blurring the input first looked like enough and is not: dropping focus does not cancel the wheel
 * event already in flight, and the browser applies the increment anyway. The only thing that stops
 * it is cancelling the event, which needs a non-passive listener.
 *
 * Cancelling alone would leave a dead patch where the page refuses to scroll, so the scroll is
 * handed on by hand to the nearest ancestor that can take it — the filter panel's own scroll area,
 * or the window. The gesture does what it looked like it would do; only the edit is dropped.
 *
 * Installed once on the document rather than as a prop on each of the app's number fields, so a new
 * one cannot inherit the bug quietly.
 */

/** The nearest ancestor that can actually scroll in `deltaY`'s direction, or null for the window. */
function scrollableAncestor(from: HTMLElement, deltaY: number): HTMLElement | null {
  let el: HTMLElement | null = from.parentElement;
  while (el) {
    const style = getComputedStyle(el);
    const scrolls = /auto|scroll|overlay/.test(style.overflowY);
    if (scrolls && el.scrollHeight > el.clientHeight) {
      const room = deltaY > 0
        ? el.scrollTop < el.scrollHeight - el.clientHeight - 1
        : el.scrollTop > 0;
      if (room) return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function installNumberInputWheelGuard(): () => void {
  const onWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement | null;
    const input = target?.closest?.('input[type="number"]') as HTMLInputElement | null;
    if (!input) return;

    e.preventDefault();
    const host = scrollableAncestor(input, e.deltaY);
    if (host) host.scrollTop += e.deltaY;
    else window.scrollBy(0, e.deltaY);
  };
  // Non-passive so preventDefault is allowed, and capture so nothing downstream can act first.
  document.addEventListener('wheel', onWheel, { passive: false, capture: true });
  return () => document.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
}
