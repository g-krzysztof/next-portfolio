import useMediaQuery from './useMediaQuery';

// Input capabilities are detected with Media Queries Level 4 instead of
// user-agent sniffing or `'ontouchstart' in window`. Hybrid devices (touch
// laptops, tablets with a mouse) report their primary pointer here, and the
// value updates live when it changes.

// Primary input is a precise pointer that can hover (mouse, trackpad).
export const useCanHover = () =>
  useMediaQuery('(hover: hover) and (pointer: fine)');
