import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLang } from './lang';
import useInView from './useInView';

// Ilustracja „mapplication” z projektu Kadme: mapa obok wyszukiwarki, warstwy
// danych i trzy motywy z case study (jasny, ciemny, dla daltonistów).
// Dane są zmyślone, liczy się sam pomysł interfejsu.

type Mode = 'light' | 'dark' | 'cvd';
type Layer = 'fields' | 'blocks' | 'wells';

const W = 640;
const H = 400;

// Deterministyczny „kartofel”: okrąg zaburzony dwiema sinusoidami
const blob = (cx: number, cy: number, r: number, seed: number, sx = 1) => {
  const steps = 56;
  const points = Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    const k =
      1 + 0.13 * Math.sin(3 * a + seed) + 0.07 * Math.sin(5 * a + seed * 2.3);
    const x = cx + Math.cos(a) * r * k * sx;
    const y = cy + Math.sin(a) * r * k;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `M${points.join('L')}Z`;
};

// Warstwice wokół dwóch wyniesień
const CONTOURS = [
  ...[1, 2, 3, 4, 5, 6].map((i) => blob(210, 190, 26 * i, 0.6 + i * 0.25, 1.3)),
  ...[1, 2, 3, 4].map((i) => blob(505, 120, 22 * i, 2.1 + i * 0.3, 1.15)),
];

const FIELDS = [
  blob(225, 200, 48, 1.4, 1.35),
  blob(470, 140, 34, 3.2, 1.2),
  blob(395, 300, 26, 0.3, 1.5),
];

const BLOCKS = Array.from({ length: 12 }, (_, i) => ({
  x: (i % 4) * 160,
  y: Math.floor(i / 4) * 134,
  label: `${7 + Math.floor(i / 4)}/${(i % 4) + 9}`,
}));

const WELLS: [number, number][] = [
  [180, 178],
  [214, 228],
  [262, 186],
  [238, 160],
  [292, 222],
  [452, 128],
  [488, 156],
  [470, 104],
  [382, 296],
  [410, 312],
  [120, 300],
  [560, 260],
  [330, 90],
];

const SELECTED: [number, number] = [262, 186];

const MapDemo = () => {
  const { copy } = useLang();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [mode, setMode] = useState<Mode>('light');
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    fields: true,
    blocks: true,
    wells: true,
  });

  const toggle = (layer: Layer) =>
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  const layerButtons: { id: Layer; label: string }[] = [
    { id: 'fields', label: copy.mapLayerFields },
    { id: 'blocks', label: copy.mapLayerBlocks },
    { id: 'wells', label: copy.mapLayerWells },
  ];
  const modeButtons: { id: Mode; label: string }[] = [
    { id: 'light', label: copy.mapThemeLight },
    { id: 'dark', label: copy.mapThemeDark },
    { id: 'cvd', label: copy.mapThemeCvd },
  ];

  return (
    <Figure ref={ref} $mode={mode} $in={inView}>
      <Search aria-hidden="true">
        <SearchIcon viewBox="0 0 20 20">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M13 13l4.5 4.5" />
        </SearchIcon>
        <code>
          <Token>well*</Token> <Op>AND</Op> <Token>status:</Token>producing{' '}
          <Op>NOT</Op> <Token>type:</Token>exploration
        </code>
      </Search>

      <MapBox>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={copy.mapDemo}>
          <rect width={W} height={H} className="base" />
          <g className="contours">
            {CONTOURS.map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                style={{ transitionDelay: `${i * 70}ms` }}
              />
            ))}
          </g>

          <g className={`layer blocks${layers.blocks ? '' : ' off'}`}>
            {BLOCKS.map(({ x, y, label }) => (
              <g key={label}>
                <rect x={x + 4} y={y + 4} width={152} height={126} />
                <text x={x + 12} y={y + 22}>
                  {label}
                </text>
              </g>
            ))}
          </g>

          <g className={`layer fields${layers.fields ? '' : ' off'}`}>
            {FIELDS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          <g className={`layer wells${layers.wells ? '' : ' off'}`}>
            {WELLS.map(([x, y]) => (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                <circle r="4.5" />
                <path d="M-8 0H8M0 -8V8" />
              </g>
            ))}
          </g>

          <g
            className="selected"
            transform={`translate(${SELECTED[0]} ${SELECTED[1]})`}
          >
            <circle className="pulse" r="10" />
            <circle className="dot" r="6" />
            <path className="leader" d="M-8 -8L-60 -60L-90 -74" />
            <g transform="translate(-222 -126)">
              <rect className="card" width="150" height="52" rx="10" />
              <text className="cardTitle" x="12" y="22">
                A-12 · producing
              </text>
              <text className="cardMeta" x="12" y="40">
                TD 2 418 m · 7/10
              </text>
            </g>
          </g>
        </svg>
        <Result aria-hidden="true">{copy.mapResult}</Result>
      </MapBox>

      <Controls>
        <Group role="group" aria-label={copy.mapLayers}>
          <GroupLabel>{copy.mapLayers}</GroupLabel>
          {layerButtons.map(({ id, label }) => (
            <Chip
              key={id}
              type="button"
              aria-pressed={layers[id]}
              onClick={() => toggle(id)}
            >
              <Swatch $layer={id} aria-hidden="true" />
              {label}
            </Chip>
          ))}
        </Group>
        <Group role="group" aria-label={copy.mapTheme}>
          <GroupLabel>{copy.mapTheme}</GroupLabel>
          {modeButtons.map(({ id, label }) => (
            <Chip
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
            >
              {label}
            </Chip>
          ))}
        </Group>
      </Controls>
      <Caption>{copy.mapCaption}</Caption>
    </Figure>
  );
};

export default MapDemo;

// Palety motywów. Daltonizm za case study: ciemna mapa bazowa i jasny UI,
// kolory z osi niebiesko-pomarańczowej zamiast czerwono-zielonej.
const PALETTES: Record<Mode, Record<string, string>> = {
  light: {
    '--ui': '#FFFFFF',
    '--ui-ink': '#10201F',
    '--ui-soft': '#4F6965',
    '--ui-line': '#CFDCD6',
    '--accent': '#23706F',
    '--base': '#EEF3EF',
    '--contour': '#C3D6CE',
    '--field': 'rgba(80, 163, 162, 0.32)',
    '--field-line': '#23706F',
    '--block': '#7D958F',
    '--well': '#10201F',
    '--hit': '#8FE388',
    '--hit-ink': '#10201F',
  },
  dark: {
    '--ui': '#0F3B3A',
    '--ui-ink': '#F3F6F1',
    '--ui-soft': '#C6DAD5',
    '--ui-line': '#1E5250',
    '--accent': '#8FE388',
    '--base': '#0A2C2B',
    '--contour': '#19484A',
    '--field': 'rgba(80, 163, 162, 0.38)',
    '--field-line': '#50A3A2',
    '--block': '#5E8C86',
    '--well': '#F3F6F1',
    '--hit': '#8FE388',
    '--hit-ink': '#0A2C2B',
  },
  cvd: {
    '--ui': '#FFFFFF',
    '--ui-ink': '#111A2B',
    '--ui-soft': '#465670',
    '--ui-line': '#D3DAE6',
    '--accent': '#1F5FBF',
    '--base': '#111A2B',
    '--contour': '#24324D',
    '--field': 'rgba(76, 155, 232, 0.4)',
    '--field-line': '#7DB8F2',
    '--block': '#8291AD',
    '--well': '#FFFFFF',
    '--hit': '#FFB000',
    '--hit-ink': '#111A2B',
  },
};

const pulse = keyframes`
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(2.6); opacity: 0; }
`;

const Figure = styled.figure<{ $mode: Mode; $in: boolean }>`
  ${({ $mode }) => PALETTES[$mode]};
  margin: 0;
  padding: clamp(12px, 1.4vw, 18px);
  border-radius: ${({ theme }) => theme.radii.card};
  background: var(--ui);
  color: var(--ui-ink);
  border: 1px solid var(--ui-line);
  transition:
    background-color 0.4s ${({ theme }) => theme.ease.out},
    color 0.4s ${({ theme }) => theme.ease.out},
    border-color 0.4s ${({ theme }) => theme.ease.out};

  svg * {
    transition:
      fill 0.4s ${({ theme }) => theme.ease.out},
      stroke 0.4s ${({ theme }) => theme.ease.out},
      opacity 0.35s ${({ theme }) => theme.ease.out};
  }

  .base {
    fill: var(--base);
  }
  .contours path {
    fill: none;
    stroke: var(--contour);
    stroke-width: 1.2;
    stroke-dasharray: 1;
    stroke-dashoffset: ${({ $in }) => ($in ? 0 : 1)};
    transition:
      stroke-dashoffset 1.6s ${({ theme }) => theme.ease.out},
      stroke 0.4s ${({ theme }) => theme.ease.out};
  }
  .layer.off {
    opacity: 0;
  }
  .blocks rect {
    fill: none;
    stroke: var(--block);
    stroke-width: 1;
    stroke-dasharray: 5 5;
  }
  .blocks text {
    fill: var(--block);
    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .fields path {
    fill: var(--field);
    stroke: var(--field-line);
    stroke-width: 1.5;
  }
  .wells circle {
    fill: var(--base);
    stroke: var(--well);
    stroke-width: 1.6;
  }
  .wells path {
    stroke: var(--well);
    stroke-width: 1.2;
  }
  .selected {
    opacity: ${({ $in }) => ($in ? 1 : 0)};
    transition: opacity 0.5s ${({ theme }) => theme.ease.out} 1.2s;
  }
  .selected .pulse {
    fill: var(--hit);
    transform-box: fill-box;
    transform-origin: center;
    animation: ${pulse} 2.2s ${({ theme }) => theme.ease.out} infinite;
  }
  .selected .dot {
    fill: var(--hit);
    stroke: var(--hit-ink);
    stroke-width: 2;
  }
  .selected .leader {
    fill: none;
    stroke: var(--hit);
    stroke-width: 1.5;
  }
  .selected .card {
    fill: var(--ui);
    stroke: var(--hit);
    stroke-width: 1.5;
  }
  .selected .cardTitle {
    fill: var(--ui-ink);
    font-size: 13px;
    font-weight: 700;
  }
  .selected .cardMeta {
    fill: var(--ui-soft);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  @media (prefers-reduced-motion: reduce) {
    .contours path {
      stroke-dasharray: none;
      transition: none;
    }
    .selected {
      opacity: 1;
      transition: none;
    }
    .selected .pulse {
      animation: none;
      opacity: 0;
    }
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 16px;
  margin-bottom: 12px;
  border-radius: ${({ theme }) => theme.radii.control};
  border: 1px solid var(--ui-line);
  color: var(--ui-soft);
  overflow: hidden;
  code {
    font-family: ui-monospace, monospace;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SearchIcon = styled.svg`
  flex: none;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
`;

const Token = styled.span`
  color: var(--ui-ink);
  font-weight: 600;
`;

const Op = styled.span`
  color: var(--accent);
  font-weight: 700;
`;

const MapBox = styled.div`
  position: relative;
  border-radius: calc(${({ theme }) => theme.radii.card} - 12px);
  overflow: hidden;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Result = styled.span`
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--ui);
  color: var(--ui-ink);
  font-size: 12px;
  font-weight: 600;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px 24px;
  margin-top: 14px;
`;

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const GroupLabel = styled.span`
  margin-right: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-soft);
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--ui-line);
  background: transparent;
  color: var(--ui-ink);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  &[aria-pressed='false'] {
    color: var(--ui-soft);
  }
  &[aria-pressed='true'] {
    border-color: var(--accent);
    box-shadow: inset 0 0 0 1px var(--accent);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;

const swatch = {
  fields: css`
    background: var(--field);
    border: 1.5px solid var(--field-line);
    border-radius: 50%;
  `,
  blocks: css`
    border: 1.5px dashed var(--block);
    border-radius: 2px;
  `,
  wells: css`
    border: 1.5px solid currentColor;
    border-radius: 50%;
    width: 9px;
    height: 9px;
  `,
};

const Swatch = styled.span<{ $layer: Layer }>`
  width: 12px;
  height: 12px;
  ${({ $layer }) => swatch[$layer]};
  [aria-pressed='false'] > & {
    opacity: 0.4;
  }
`;

const Caption = styled.figcaption`
  margin-top: 10px;
  font-size: 12px;
  color: var(--ui-soft);
`;
