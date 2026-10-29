/** Share of the viewport over which the camera leaves the overview for the first stop. */
const OVERVIEW_LEAD = 0.45;

/**
 * Where the camera is along the timeline for a reading line at `y` (document pixels):
 * -1 is the overview, `i` sits on role `i`, and fractions are flights between roles.
 * `anchors` are the document y positions of each role, top to bottom.
 */
export function flightAt(y: number, anchors: readonly number[], viewportHeight: number): number {
  const first = anchors[0];
  if (first === undefined) return -1;
  const lead = viewportHeight * OVERVIEW_LEAD;
  if (y <= first - lead) return -1;
  if (y < first) return -1 + (y - (first - lead)) / lead;
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const from = anchors[i] ?? 0;
    const to = anchors[i + 1] ?? from;
    if (y < to) return i + (to > from ? (y - from) / (to - from) : 0);
  }
  return anchors.length - 1;
}
