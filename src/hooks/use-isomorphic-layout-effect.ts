"use client";

import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect in the browser, useEffect on the server (where it would only warn). */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
