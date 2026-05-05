export const useReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
