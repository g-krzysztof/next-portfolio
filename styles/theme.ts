import breakpoints from './breakpoints';

export const theme = {
  colors: {
    // głęboki turkus: pole hero i stopki
    field: '#0F3B3A',
    fieldDeep: '#0A2C2B',
    // turkus z poprzedniej wersji strony
    teal: '#50A3A2',
    tealInk: '#23706F',
    // następca dawnej zieleni #78CC6D
    mint: '#8FE388',
    paper: '#F3F6F1',
    paperDeep: '#E3ECE7',
    line: '#CFDCD6',
    ink: '#10201F',
    inkSoft: '#2D4644',
    inkMuted: '#4F6965',
    onField: '#F3F6F1',
    onFieldSoft: '#C6DAD5',
  },
  fonts: {
    display: 'var(--font-display), system-ui, sans-serif',
    body: 'var(--font-body), system-ui, sans-serif',
  },
  fontWeights: {
    regular: `400`,
    medium: `500`,
    bold: `600`,
    black: `800`,
  },
  breakpoints,
  space: {
    space5: '5px',
    space10: '10px',
    space15: '15px',
    space20: '20px',
    space30: '30px',
    space50: '50px',
    space100: '100px',
  },
  radii: {
    control: '14px',
    card: '28px',
  },
  layout: {
    maxWidth: '1600px',
    gutter: 'clamp(20px, 5vw, 96px)',
    navHeight: '76px',
  },
  ease: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

export type Theme = typeof theme;
