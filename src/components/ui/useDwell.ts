"use client";

import { useEffect, useState } from "react";

/**
 * `flag`, but only once it has stayed true for `ms` — so a fling or an anchor jump that merely passes a
 * section does not start its video downloads. Turns false again at once.
 */
export function useDwell(flag: boolean, ms = 300) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!flag) {
      const off = window.setTimeout(() => setSettled(false), 0);
      return () => window.clearTimeout(off);
    }
    const t = window.setTimeout(() => setSettled(true), ms);
    return () => window.clearTimeout(t);
  }, [flag, ms]);
  return flag && settled;
}
