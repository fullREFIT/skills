// Deterministic slide-fit engine. The #1 presenter rule is "no slide ever overflows
// the viewport or clips text." We do NOT rely on overflow:hidden or visual cropping to
// achieve that — we MEASURE and step the slide down through density classes until it
// genuinely fits inside the fixed stage.
//
// How it works:
//   - The stage is a fixed-height box (flex:1 inside a 100dvh-locked column). Its
//     clientHeight is the available presenter height and does not grow with content.
//   - The slide inside it has natural (auto) height. slide.scrollHeight is therefore the
//     height the content actually wants.
//   - We set data-density on the stage (spacious → standard → compact → critical-compact).
//     Each class scales type, gaps, padding, and collapses multi-column layouts via CSS,
//     so re-reading scrollHeight after each change reflects the new layout.
//   - We pick the LEAST aggressive density that fits (overshoot <= tolerance).
//   - If even critical-compact overflows, we flag data-fit="overflow" so QA/build can catch
//     it. Validation content budgets exist precisely so this rarely happens.

export type Density = 'spacious' | 'standard' | 'compact' | 'critical-compact';

// Least → most aggressive. The engine stops at the first that fits.
export const DENSITIES: readonly Density[] = ['spacious', 'standard', 'compact', 'critical-compact'];

// Sub-pixel rounding + border tolerance. A slide within 2px of the stage is "fit".
const TOLERANCE_PX = 2;

export interface FitResult {
  density: Density;
  fits: boolean;
  overshootPx: number;
}

/**
 * Fit `slide` inside `stage` by selecting the least aggressive density that contains it.
 * Mutates stage.dataset.density and stage.dataset.fit. Returns the chosen density and
 * whether it genuinely fits. Synchronous — each density read forces a layout so the next
 * measurement is accurate.
 */
export function fitSlide(stage: HTMLElement, slide: HTMLElement): FitResult {
  let result: FitResult = { density: 'critical-compact', fits: false, overshootPx: 0 };

  for (const density of DENSITIES) {
    stage.dataset.density = density;
    const overshoot = measureOvershoot(stage, slide);
    const fits = overshoot <= TOLERANCE_PX;
    result = { density, fits, overshootPx: Math.max(0, Math.round(overshoot)) };
    if (fits) {
      stage.dataset.fit = 'ok';
      return result;
    }
  }

  // Exhausted all densities — clip as a last resort but flag it loudly for QA.
  stage.dataset.fit = 'overflow';
  return result;
}

// Largest of vertical and horizontal overshoot, in px. Reading client/scroll metrics
// forces a synchronous reflow, which is what makes the step loop deterministic.
function measureOvershoot(stage: HTMLElement, slide: HTMLElement): number {
  const availH = stage.clientHeight;
  const availW = stage.clientWidth;
  const neededH = slide.scrollHeight;
  const neededW = slide.scrollWidth;
  return Math.max(neededH - availH, neededW - availW);
}
