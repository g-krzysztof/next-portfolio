import styled, { keyframes } from 'styled-components';

// Następca kwadratów z tła poprzedniej wersji strony: zaokrąglone obrysy
// wolno wznoszą się przez turkusowe pole i obracają.
// Ujemne opóźnienia sprawiają, że kwadraty są rozsiane po polu od pierwszej
// klatki, zamiast wyjeżdżać dopiero spod krawędzi.
// x: pozycja w % szerokości, size: bok w px, o: krycie, d: czas wznoszenia w s,
// delay: przesunięcie fazy w s, mint: obrys w kolorze mięty
const SQUARES = [
  { x: 6, size: 220, o: 0.07, d: 46, delay: -8 },
  { x: 15, size: 64, o: 0.12, d: 30, delay: -22 },
  { x: 24, size: 120, o: 0.06, d: 38, delay: -3 },
  { x: 33, size: 40, o: 0.14, d: 26, delay: -15, mint: true },
  { x: 42, size: 160, o: 0.05, d: 44, delay: -30 },
  { x: 51, size: 52, o: 0.1, d: 28, delay: -6 },
  { x: 60, size: 260, o: 0.05, d: 52, delay: -40 },
  { x: 68, size: 80, o: 0.09, d: 34, delay: -18, mint: true },
  { x: 77, size: 36, o: 0.13, d: 24, delay: -11 },
  { x: 85, size: 140, o: 0.06, d: 40, delay: -26 },
  { x: 93, size: 56, o: 0.11, d: 30, delay: -2 },
  { x: 98, size: 320, o: 0.04, d: 58, delay: -34 },
];

const FloatingSquares = ({ count = SQUARES.length }) => (
  <Layer aria-hidden="true">
    {SQUARES.slice(0, count).map(({ x, size, o, d, delay, mint }) => (
      <Column
        key={x}
        style={{
          left: `${x}%`,
          '--size': `${size}px`,
          '--d': `${d}s`,
          '--delay': `${delay}s`,
        }}
      >
        <Square $mint={mint} style={{ opacity: o }} />
      </Column>
    ))}
  </Layer>
);

export default FloatingSquares;

// Kolumna ma wysokość warstwy, więc translateY(-100%) to dokładnie wysokość
// pola, niezależnie od tego, jak wysoka jest sekcja
const rise = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--size) * 1.5)); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Rodzic potrzebuje isolation: isolate; wtedy z-index: -1 kładzie warstwę
// nad tłem rodzica, ale pod całą jego treścią
const Layer = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

const Column = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: var(--size);
  margin-left: calc(var(--size) / -2);
  animation: ${rise} var(--d) linear var(--delay) infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation-play-state: paused;
  }
`;

const Square = styled.span`
  position: absolute;
  top: 100%;
  left: 0;
  width: var(--size);
  height: var(--size);
  border: 1.5px solid
    ${({ theme, $mint }) => ($mint ? theme.colors.mint : theme.colors.onField)};
  border-radius: calc(var(--size) * 0.18);
  /* obrót wolniejszy niż wznoszenie i z innym rytmem, żeby ruch nie był mechaniczny */
  animation: ${spin} calc(var(--d) * 1.6) linear var(--delay) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-play-state: paused;
  }
`;
