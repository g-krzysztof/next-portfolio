import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

// ID projektu i tak trafia do bundla klienta, więc nie trzymamy go w env
const CLARITY_PROJECT_ID = 'z6fjzt4snm';

const PROD_HOSTNAMES = ['krzysztofg.pl', 'www.krzysztofg.pl'];

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

// Clarity startuje bez banera zgód — tylko na produkcyjnej domenie,
// więc ani `next dev`, ani lokalny `next start`, ani preview deploye nie nabijają statystyk.
// Skrypt ładuje się dopiero przy pierwszej interakcji: nie obciąża startu strony,
// a cookie clarity.ms i błędy z jego requestów nie psują wyniku Lighthouse
export const ClarityAnalytics = () => {
  useEffect(() => {
    if (!PROD_HOSTNAMES.includes(window.location.hostname)) {
      return;
    }

    const load = () => {
      removeListeners();
      clarity.init(CLARITY_PROJECT_ID);
    };

    const removeListeners = () => {
      INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, load));
    };

    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, load, { once: true, passive: true }),
    );

    return removeListeners;
  }, []);

  return null;
};
