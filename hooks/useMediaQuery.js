import { useCallback, useSyncExternalStore } from 'react';

// On the server (and during hydration) the result is unknown, so `null` is
// returned. Callers can use it to avoid rendering a layout that might be wrong.
const getServerSnapshot = () => null;

export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
