import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

// ID projektu i tak trafia do bundla klienta, więc nie trzymamy go w env
const CLARITY_PROJECT_ID = 'z6fjzt4snm';

const PROD_HOSTNAMES = ['krzysztofg.pl', 'www.krzysztofg.pl'];

// Clarity startuje od razu, bez banera zgód — tylko na produkcyjnej domenie,
// więc ani `next dev`, ani lokalny `next start`, ani preview deploye nie nabijają statystyk
export const ClarityAnalytics = () => {
  useEffect(() => {
    if (!PROD_HOSTNAMES.includes(window.location.hostname)) {
      return;
    }

    clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
};
