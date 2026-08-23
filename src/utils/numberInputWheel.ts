/**
 * Stop the mouse wheel from editing number inputs.
 *
 * A focused `<input type="number">` treats the wheel as the up/down arrows, so scrolling the page
 * with the cursor over one silently changes it. On a filter panel that is a stat bound quietly
 * moving while you read past it — the kind of wrong number you only notice through the results it
 * produces, if at all.
 *
 * Blurring is the fix rather than preventDefault: the increment only happens while the input has
 * focus, so dropping focus stops it, and the page still scrolls the way the gesture asked. The
 * listener runs before the default action, which is what makes that work.
 *
 * Installed once on the document rather than as an onWheel prop per input, because every number
 * field in the app has the problem and any new one would inherit it silently.
 */
export function installNumberInputWheelGuard(): () => void {
  const onWheel = (e: WheelEvent) => {
    const active = document.activeElement;
    if (
      active instanceof HTMLInputElement &&
      active.type === 'number' &&
      (e.target === active || active.contains(e.target as Node))
    ) {
      active.blur();
    }
  };
  document.addEventListener('wheel', onWheel, { passive: true });
  return () => document.removeEventListener('wheel', onWheel);
}
