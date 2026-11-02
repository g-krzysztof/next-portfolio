import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLang } from './lang';
import useInView from './useInView';

// Ilustracja mapy z projektu Kadme (Lumin), zbudowana wokół mojej części pracy:
// podkład terenu przemalowany na paletę marki przez przestrzeń barw HCL,
// panel warstw z przełącznikiem i suwakiem krycia oraz klik w odwiert
// z animowanym zoomem i popupem ze współrzędnymi. Dane są zmyślone.

type Layer = 'fields' | 'blocks' | 'wells';
type Basemap = 'standard' | 'brand';

const W = 640;
const H = 400;
const ZOOM = 2;

// --- Kolory: sRGB ↔ HCL (LCh nad CIELab, biel D65) -------------------------
// Ten sam pomysł co w aplikacji: jasność terenu zostaje, odcień i nasycenie
// idą z palety marki. Tam liczył to RasterSource na pikselach kafelków,
// tu wystarczy kilka kolorów pasm wysokości.

const WHITE = [0.95047, 1, 1.08883];

const hexToRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const fromLinear = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

const labF = (t: number) =>
  t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
const labFInv = (t: number) =>
  t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;

const toHcl = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / WHITE[0];
  const y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / WHITE[1];
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / WHITE[2];
  const [fx, fy, fz] = [x, y, z].map(labF);
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);
  return { h: Math.atan2(B, A), c: Math.hypot(A, B), l: 116 * fy - 16 };
};

const fromHcl = ({ h, c, l }: { h: number; c: number; l: number }) => {
  const fy = (l + 16) / 116;
  const fx = fy + (c * Math.cos(h)) / 500;
  const fz = fy - (c * Math.sin(h)) / 200;
  const [x, y, z] = [fx, fy, fz].map((f, i) => labFInv(f) * WHITE[i]);
  const rgb = [
    3.2406 * x - 1.5372 * y - 0.4986 * z,
    -0.9689 * x + 1.8758 * y + 0.0415 * z,
    0.0557 * x - 0.204 * y + 1.057 * z,
  ];
  return `rgb(${rgb
    .map((v) => Math.round(Math.min(1, Math.max(0, fromLinear(v))) * 255))
    .join(' ')})`;
};

const BRAND_HUE = toHcl('#23706F').h;

const recolor = (hex: string) => {
  const { c, l } = toHcl(hex);
  return fromHcl({ h: BRAND_HUE, c: 3 + c * 0.25, l });
};

// Pasma wysokości w stylu klasycznych kafelków terenu: od nizin po szczyty
const TERRAIN = [
  '#CFE0B4',
  '#BCD49B',
  '#D5DCA2',
  '#E6DBA9',
  '#E1C799',
  '#D1AE88',
  '#BD9676',
];
const PALETTE: Record<Basemap, string[]> = {
  standard: TERRAIN,
  brand: TERRAIN.map(recolor),
};

// --- Geometria --------------------------------------------------------------

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

// Pasma wokół dwóch wyniesień, od największego: każde kolejne leży wyżej
const BANDS = [
  ...[6, 5, 4, 3, 2, 1].map((i) => ({
    d: blob(210, 190, 26 * i, 0.6 + i * 0.25, 1.3),
    level: 7 - i,
  })),
  ...[4, 3, 2, 1].map((i) => ({
    d: blob(505, 120, 22 * i, 2.1 + i * 0.3, 1.15),
    level: 5 - i,
  })),
];

const FIELDS = [
  blob(225, 200, 48, 1.4, 1.35),
  blob(470, 140, 34, 3.2, 1.2),
  blob(395, 300, 26, 0.3, 1.5),
];

const BLOCK_W = 160;
const BLOCK_H = 134;
const blockLabel = (x: number, y: number) =>
  `${7 + Math.floor(y / BLOCK_H)}/${Math.floor(x / BLOCK_W) + 9}`;

const BLOCKS = Array.from({ length: 12 }, (_, i) => ({
  x: (i % 4) * BLOCK_W,
  y: Math.floor(i / 4) * BLOCK_H,
}));

type Well = { name: string; x: number; y: number; status: string };

const WELLS: Well[] = [
  { name: 'A-7', x: 180, y: 178, status: 'producing' },
  { name: 'A-9', x: 214, y: 228, status: 'producing' },
  { name: 'A-12', x: 262, y: 186, status: 'producing' },
  { name: 'A-14', x: 238, y: 160, status: 'shut-in' },
  { name: 'A-15', x: 292, y: 222, status: 'producing' },
  { name: 'B-2', x: 452, y: 128, status: 'producing' },
  { name: 'B-3', x: 488, y: 156, status: 'producing' },
  { name: 'B-5', x: 470, y: 104, status: 'shut-in' },
  { name: 'C-1', x: 382, y: 296, status: 'producing' },
  { name: 'C-4', x: 410, y: 312, status: 'producing' },
  { name: 'D-1', x: 120, y: 300, status: 'plugged' },
  { name: 'E-3', x: 560, y: 260, status: 'shut-in' },
  { name: 'F-2', x: 330, y: 90, status: 'producing' },
];

// Wycinek Morza Północnego, na który rzutujemy układ SVG
const coords = ({ x, y }: Well, lang: string) => {
  const fmt = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const lat = 58.8 - (y / H) * 0.8;
  const lon = 1.8 + (x / W) * 1.4;
  return `${fmt.format(lat)}° N · ${fmt.format(lon)}° E`;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// Przesunięcie, które stawia odwiert na środku, ale nie wyjeżdża poza mapę
const viewFor = (well: Well | null) => {
  if (!well) return { s: 1, tx: 0, ty: 0 };
  return {
    s: ZOOM,
    tx: clamp(W / 2 - well.x * ZOOM, W - W * ZOOM, 0),
    ty: clamp(H / 2 - well.y * ZOOM, H - H * ZOOM, 0),
  };
};

const MapDemo = () => {
  const { lang, copy } = useLang();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [basemap, setBasemap] = useState<Basemap>('brand');
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    fields: true,
    blocks: true,
    wells: true,
  });
  const [opacity, setOpacity] = useState<Record<Layer, number>>({
    fields: 100,
    blocks: 70,
    wells: 100,
  });
  const [selected, setSelected] = useState<Well | null>(null);

  const view = viewFor(selected);
  const palette = PALETTE[basemap];

  const layerRows: { id: Layer; label: string }[] = [
    { id: 'fields', label: copy.mapLayerFields },
    { id: 'blocks', label: copy.mapLayerBlocks },
    { id: 'wells', label: copy.mapLayerWells },
  ];
  const basemaps: { id: Basemap; label: string }[] = [
    { id: 'standard', label: copy.mapBaseStandard },
    { id: 'brand', label: copy.mapBaseBrand },
  ];

  const layerStyle = (id: Layer) => ({
    opacity: layers[id] ? opacity[id] / 100 : 0,
  });

  const select = (well: Well) =>
    setSelected((prev) => (prev?.name === well.name ? null : well));

  return (
    <Figure ref={ref} $in={inView}>
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
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={copy.mapDemo}>
          <g
            className="view"
            style={{
              transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
            }}
          >
            <rect
              width={W}
              height={H}
              className="base"
              style={{ fill: palette[0] }}
              onClick={() => setSelected(null)}
            />
            <g className="terrain">
              {BANDS.map(({ d, level }, i) => (
                <path
                  key={d}
                  d={d}
                  style={{
                    fill: palette[level],
                    transitionDelay: `${level * 60}ms, ${i * 70}ms`,
                  }}
                />
              ))}
            </g>

            <g className="layer blocks" style={layerStyle('blocks')}>
              {BLOCKS.map(({ x, y }) => (
                <g key={`${x}-${y}`}>
                  <rect
                    x={x + 4}
                    y={y + 4}
                    width={BLOCK_W - 8}
                    height={BLOCK_H - 8}
                  />
                  <text x={x + 12} y={y + 22}>
                    {blockLabel(x, y)}
                  </text>
                </g>
              ))}
            </g>

            <g className="layer fields" style={layerStyle('fields')}>
              {FIELDS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>

            <g
              className="layer wells"
              style={layerStyle('wells')}
              aria-hidden={!layers.wells}
            >
              {WELLS.map((well) => {
                const active = selected?.name === well.name;
                return (
                  <g
                    key={well.name}
                    className={`well${active ? ' active' : ''}`}
                    transform={`translate(${well.x} ${well.y})`}
                    role="button"
                    tabIndex={layers.wells ? 0 : -1}
                    aria-label={copy.mapWell(well.name)}
                    aria-pressed={active}
                    onClick={() => select(well)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        select(well);
                      }
                    }}
                  >
                    <circle className="hit" r="16" />
                    {active && <circle className="pulse" r="10" />}
                    <circle className="ring" r="4.5" />
                    <path d="M-8 0H8M0 -8V8" />
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {selected && (
          <Popup
            key={selected.name}
            style={{
              left: `${((selected.x * view.s + view.tx) / W) * 100}%`,
              top: `${((selected.y * view.s + view.ty) / H) * 100}%`,
            }}
            aria-live="polite"
          >
            <strong>
              {selected.name} · {selected.status}
            </strong>
            <span>{coords(selected, lang)}</span>
            <span>{copy.mapBlock(blockLabel(selected.x, selected.y))}</span>
          </Popup>
        )}

        <Result aria-hidden="true">{copy.mapResult}</Result>
        {selected ? (
          <Reset type="button" onClick={() => setSelected(null)}>
            {copy.mapReset}
          </Reset>
        ) : (
          <Hint aria-hidden="true">{copy.mapHint}</Hint>
        )}
      </MapBox>

      <Controls>
        <Panel role="group" aria-label={copy.mapLayers}>
          <GroupLabel>{copy.mapLayers}</GroupLabel>
          {layerRows.map(({ id, label }) => (
            <Row key={id}>
              <Switch
                type="button"
                role="switch"
                aria-checked={layers[id]}
                onClick={() => {
                  if (id === 'wells' && layers.wells) setSelected(null);
                  setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
                }}
              >
                <Track aria-hidden="true" />
                <Swatch $layer={id} aria-hidden="true" />
                {label}
              </Switch>
              <Range
                type="range"
                min={20}
                max={100}
                step={5}
                value={opacity[id]}
                disabled={!layers[id]}
                aria-label={copy.mapOpacity(label)}
                aria-valuetext={`${opacity[id]}%`}
                onChange={(event) =>
                  setOpacity((prev) => ({
                    ...prev,
                    [id]: Number(event.target.value),
                  }))
                }
              />
            </Row>
          ))}
        </Panel>

        <Panel role="group" aria-label={copy.mapBasemap}>
          <GroupLabel>{copy.mapBasemap}</GroupLabel>
          <Chips>
            {basemaps.map(({ id, label }) => (
              <Chip
                key={id}
                type="button"
                aria-pressed={basemap === id}
                onClick={() => setBasemap(id)}
              >
                <Ramp aria-hidden="true">
                  {PALETTE[id].map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </Ramp>
                {label}
              </Chip>
            ))}
          </Chips>
          <Note>{copy.mapBaseNote}</Note>
        </Panel>
      </Controls>
      <Caption>{copy.demoCaption}</Caption>
    </Figure>
  );
};

export default MapDemo;

const pulse = keyframes`
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(2.6); opacity: 0; }
`;

const pop = keyframes`
  from { opacity: 0; transform: translate(-50%, calc(-100% - 6px)); }
  to { opacity: 1; transform: translate(-50%, calc(-100% - 16px)); }
`;

const Figure = styled.figure<{ $in: boolean }>`
  --ui: #ffffff;
  --ui-ink: #10201f;
  --ui-soft: #4f6965;
  --ui-line: #cfdcd6;
  --accent: ${({ theme }) => theme.colors.tealInk};
  --field: rgba(35, 112, 111, 0.34);
  --field-line: #1b5958;
  --block: #4f6965;
  --well: #10201f;
  --hit: ${({ theme }) => theme.colors.mint};

  container-type: inline-size;
  margin: 0;
  padding: clamp(12px, 1.4vw, 18px);
  border-radius: ${({ theme }) => theme.radii.card};
  background: var(--ui);
  color: var(--ui-ink);
  border: 1px solid var(--ui-line);

  .view {
    transform-origin: 0 0;
    transition: transform 0.7s ${({ theme }) => theme.ease.out};
  }
  .base {
    transition: fill 0.5s ${({ theme }) => theme.ease.out};
  }
  /* pasma przemalowują się od nizin w górę, a na wejściu wyłaniają po kolei */
  .terrain path {
    stroke: rgba(16, 32, 31, 0.12);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    opacity: ${({ $in }) => ($in ? 1 : 0)};
    transition:
      fill 0.5s ${({ theme }) => theme.ease.out},
      opacity 0.6s ${({ theme }) => theme.ease.out};
  }
  .layer {
    transition: opacity 0.3s ${({ theme }) => theme.ease.out};
  }
  .blocks rect {
    fill: none;
    stroke: var(--block);
    stroke-width: 1;
    stroke-dasharray: 5 5;
    vector-effect: non-scaling-stroke;
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
    vector-effect: non-scaling-stroke;
  }
  .well {
    cursor: pointer;
    outline: none;
  }
  .well .hit {
    fill: transparent;
  }
  .well .ring {
    fill: #ffffff;
    stroke: var(--well);
    stroke-width: 1.6;
    transition: fill 0.2s ${({ theme }) => theme.ease.out};
  }
  .well path {
    stroke: var(--well);
    stroke-width: 1.2;
    pointer-events: none;
  }
  .well:hover .ring,
  .well.active .ring {
    fill: var(--hit);
  }
  .well:focus-visible .hit {
    stroke: var(--accent);
    stroke-width: 2;
  }
  .well .pulse {
    fill: var(--hit);
    transform-box: fill-box;
    transform-origin: center;
    animation: ${pulse} 2.2s ${({ theme }) => theme.ease.out} infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .view,
    .terrain path {
      transition: none;
    }
    .terrain path {
      opacity: 1;
    }
    .well .pulse {
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

const Popup = styled.div`
  position: absolute;
  display: grid;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--ui);
  border: 1.5px solid var(--hit);
  box-shadow: 0 6px 18px rgba(16, 32, 31, 0.14);
  font-size: 11px;
  color: var(--ui-soft);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 16px));
  animation: ${pop} 0.35s ${({ theme }) => theme.ease.out} 0.45s both;
  strong {
    font-size: 13px;
    color: var(--ui-ink);
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const overlay = `
  position: absolute;
  bottom: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--ui);
  color: var(--ui-ink);
  font-size: 12px;
  font-weight: 600;
`;

const Result = styled.span`
  ${overlay};
  left: 12px;
`;

const Hint = styled.span`
  ${overlay};
  right: 12px;
  color: var(--ui-soft);
`;

const Reset = styled.button`
  ${overlay};
  right: 12px;
  border: 1px solid var(--accent);
  font-family: inherit;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  @container (max-width: 500px) {
    grid-template-columns: minmax(0, 1fr);
  }
  gap: 16px 28px;
  margin-top: 14px;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-soft);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(56px, 84px);
  align-items: center;
  gap: 12px;
`;

const Track = styled.span`
  position: relative;
  flex: none;
  width: 30px;
  height: 18px;
  border-radius: 999px;
  background: var(--ui-line);
  transition: background-color 0.2s ${({ theme }) => theme.ease.out};
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(16, 32, 31, 0.25);
    transition: transform 0.2s ${({ theme }) => theme.ease.out};
  }
`;

const Switch = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ui-ink);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  &[aria-checked='true'] ${Track} {
    background: var(--accent);
  }
  &[aria-checked='true'] ${Track}::after {
    transform: translateX(12px);
  }
  &[aria-checked='false'] {
    color: var(--ui-soft);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const Range = styled.input`
  width: 100%;
  accent-color: var(--accent);
  cursor: pointer;
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const swatch = {
  fields: `
    background: var(--field);
    border: 1.5px solid var(--field-line);
    border-radius: 50%;
  `,
  blocks: `
    border: 1.5px dashed var(--block);
    border-radius: 2px;
  `,
  wells: `
    border: 1.5px solid var(--well);
    border-radius: 50%;
    width: 9px;
    height: 9px;
    margin: 0 1.5px;
  `,
};

const Swatch = styled.span<{ $layer: Layer }>`
  flex: none;
  width: 12px;
  height: 12px;
  ${({ $layer }) => swatch[$layer]};
  [aria-checked='false'] > & {
    opacity: 0.4;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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
  transition: border-color 0.25s ${({ theme }) => theme.ease.out};
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

// próbka pasm terenu: od razu widać, co zmienia przełącznik
const Ramp = styled.span`
  display: inline-flex;
  border-radius: 3px;
  overflow: hidden;
  span {
    width: 5px;
    height: 14px;
  }
`;

const Note = styled.p`
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--ui-soft);
`;

const Caption = styled.figcaption`
  margin-top: 10px;
  font-size: 12px;
  color: var(--ui-soft);
`;
