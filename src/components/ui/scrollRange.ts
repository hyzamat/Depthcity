/**
 * framer-motion hands opacity / filter / clipPath / backgroundColor transforms of a
 * useScroll() progress to native ScrollTimeline animations. Native keyframes are not
 * clamped: if the input range doesn't start at 0 and end at 1, the browser synthesises
 * neutral keyframes at the ends, so a value meant to hold its last output drifts back to
 * the CSS default (e.g. a caption that faded out at 20% fades back in by 100%).
 * Padding the range out to [0, 1] with the edge outputs restores clamped behaviour.
 *
 *   useTransform(scrollYProgress, ...pad([0.2, 0.3], [0, 1]))
 */
export function pad<T>(input: number[], output: T[]): [number[], T[]] {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) {
    i.unshift(0);
    o.unshift(o[0]);
  }
  if (i[i.length - 1] < 1) {
    i.push(1);
    o.push(o[o.length - 1]);
  }
  return [i, o];
}
