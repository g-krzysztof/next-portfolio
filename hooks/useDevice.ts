import useMediaQuery from './useMediaQuery';

// Input capabilities are detected with Media Queries Level 4 instead of
// user-agent sniffing or `'ontouchstart' in window`. Hybrid devices (touch
// laptops, tablets with a mouse) report their primary pointer here, and the
// value updates live when it changes.

// Primary input is a finger/stylus and cannot hover.
export const useIsTouchDevice = () =>
  useMediaQuery('(hover: none) and (pointer: coarse)');

// Primary input is a precise pointer that can hover (mouse, trackpad).
export const useCanHover = () =>
  useMediaQuery('(hover: hover) and (pointer: fine)');

// Any available input is coarse, e.g. a laptop with a touchscreen.
export const useHasTouch = () => useMediaQuery('(any-pointer: coarse)');
