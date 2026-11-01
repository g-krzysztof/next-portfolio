import { useEffect, useRef, useState } from 'react';

// Jednorazowe „wjechało w widok”. Bez IntersectionObservera od razu true,
// żeby treść nigdy nie została ukryta.
const useInView = <T extends Element = HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2 },
) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView] as const;
};

export default useInView;
