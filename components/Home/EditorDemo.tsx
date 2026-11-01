import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLang } from './lang';

// Ilustracja edytora WP: artykuł składany z gotowych elementów (content parts),
// obok czytelność, podpowiedzi AI i walidacja, nad nim autozapis do local storage.
// Treść jest zmyślona, liczy się sam pomysł interfejsu.

type Part = 'image' | 'gallery' | 'quote' | 'table' | 'stocks' | 'timeline';

const PARTS: Part[] = [
  'image',
  'gallery',
  'quote',
  'table',
  'stocks',
  'timeline',
];
const MAX_BLOCKS = 4;

interface Block {
  id: number;
  part: Part;
}

// Im więcej rodzajów elementów, tym lepiej rozłożony rytm tekstu
const readability = (blocks: Block[]) =>
  Math.min(94, 58 + new Set(blocks.map(({ part }) => part)).size * 8);

const EditorDemo = () => {
  const { copy } = useLang();
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, part: 'image' },
    { id: 2, part: 'quote' },
  ]);
  const [mobile, setMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const nextId = useRef(3);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const add = (part: Part) => {
    const id = nextId.current;
    nextId.current += 1;
    setBlocks((prev) => [...prev, { id, part }].slice(-MAX_BLOCKS));
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaving(false), 900);
  };

  const score = readability(blocks);
  const warning = blocks.some(({ part }) => part === 'image');

  return (
    <Figure>
      <Bar>
        <Dots aria-hidden="true">
          <i />
          <i />
          <i />
        </Dots>
        <Status role="status" $saving={saving}>
          <span aria-hidden="true" />
          {saving ? copy.editorSaving : copy.editorSaved}
        </Status>
      </Bar>

      <Body role="img" aria-label={copy.editorDemo}>
        <Canvas $mobile={mobile}>
          <Headline />
          <Headline $short />
          <Lines $n={3} />
          {blocks.map(({ id, part }) => (
            <BlockWrap key={id}>
              <PartView part={part} />
            </BlockWrap>
          ))}
          <Lines $n={2} />
        </Canvas>

        <Side aria-hidden="true">
          <Panel>
            <PanelTitle>{copy.editorReadability}</PanelTitle>
            <Score>
              <svg viewBox="0 0 40 40">
                <circle className="track" cx="20" cy="20" r="16" />
                <circle
                  className="value"
                  cx="20"
                  cy="20"
                  r="16"
                  pathLength={100}
                  style={{ strokeDashoffset: 100 - score }}
                />
              </svg>
              <strong>{score}</strong>
            </Score>
          </Panel>
          <Panel>
            <PanelTitle>{copy.editorSuggestions}</PanelTitle>
            <Tags>
              {copy.editorTags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </Tags>
          </Panel>
          <Panel>
            <PanelTitle>{copy.editorValidation}</PanelTitle>
            <Check $warn={warning}>
              {warning ? copy.editorWarn : copy.editorOk}
            </Check>
          </Panel>
        </Side>
      </Body>

      <Controls>
        <Group role="group" aria-label={copy.editorAdd}>
          <GroupLabel>{copy.editorAdd}</GroupLabel>
          {PARTS.map((part) => (
            <Chip key={part} type="button" onClick={() => add(part)}>
              <span aria-hidden="true">+</span>
              {copy.editorParts[part]}
            </Chip>
          ))}
        </Group>
        <Group role="group" aria-label={copy.editorView}>
          <GroupLabel>{copy.editorView}</GroupLabel>
          <Chip
            type="button"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            {copy.editorEdit}
          </Chip>
          <Chip
            type="button"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            {copy.editorMobile}
          </Chip>
        </Group>
      </Controls>
      <Caption>{copy.demoCaption}</Caption>
    </Figure>
  );
};

export default EditorDemo;

// Schematyczne podglądy elementów artykułu
const PartView = ({ part }: { part: Part }) => {
  switch (part) {
    case 'image':
      return (
        <Media>
          <svg viewBox="0 0 120 60" preserveAspectRatio="none">
            <path d="M0 60L34 26L58 46L80 30L120 60Z" />
            <circle cx="92" cy="16" r="7" />
          </svg>
        </Media>
      );
    case 'gallery':
      return (
        <Gallery>
          <Media />
          <Media />
          <Media />
        </Gallery>
      );
    case 'quote':
      return (
        <Quote>
          <span>„</span>
          <Lines $n={2} />
        </Quote>
      );
    case 'table':
      return (
        <Table>
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} />
          ))}
        </Table>
      );
    case 'stocks':
      return (
        <Stocks>
          <svg viewBox="0 0 120 36" preserveAspectRatio="none">
            <path d="M0 28L14 24L26 27L40 16L54 19L68 10L82 14L96 6L120 9" />
          </svg>
          <b>+2,4%</b>
        </Stocks>
      );
    case 'timeline':
      return (
        <Timeline>
          <i />
          <i />
          <i />
          <i />
        </Timeline>
      );
    default:
      return null;
  }
};

const enter = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: none; }
`;

const Figure = styled.figure`
  margin: 0;
  padding: clamp(12px, 1.4vw, 18px);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.ink};
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 0 16px;
  margin-bottom: 12px;
  border-radius: ${({ theme }) => theme.radii.control};
  border: 1px solid ${({ theme }) => theme.colors.line};
`;

const Dots = styled.span`
  display: flex;
  gap: 6px;
  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.line};
  }
`;

const Status = styled.span<{ $saving: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $saving, theme }) =>
      $saving ? theme.colors.teal : theme.colors.mint};
    transition: background-color 0.25s ${({ theme }) => theme.ease.out};
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(150px, 0.42fr);
  gap: 12px;
  padding: 12px;
  border-radius: calc(${({ theme }) => theme.radii.card} - 12px);
  background: ${({ theme }) => theme.colors.paper};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const Canvas = styled.div<{ $mobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-self: center;
  width: 100%;
  max-width: ${({ $mobile }) => ($mobile ? '230px' : '100%')};
  min-height: 330px;
  padding: ${({ $mobile }) => ($mobile ? '22px 14px' : '20px')};
  border-radius: ${({ $mobile }) => ($mobile ? '26px' : '12px')};
  background: #ffffff;
  border: ${({ $mobile, theme }) =>
    $mobile
      ? `6px solid ${theme.colors.ink}`
      : `1px solid ${theme.colors.line}`};
  transition:
    max-width 0.5s ${({ theme }) => theme.ease.out},
    padding 0.5s ${({ theme }) => theme.ease.out},
    border-radius 0.5s ${({ theme }) => theme.ease.out};
`;

const Headline = styled.span<{ $short?: boolean }>`
  height: 14px;
  width: ${({ $short }) => ($short ? '58%' : '92%')};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.ink};
`;

const Lines = styled.span<{ $n: number }>`
  display: block;
  width: 100%;
  height: ${({ $n }) => $n * 14 - 6}px;
  background: repeating-linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.line} 0 8px,
    transparent 8px 14px
  );
  mask: linear-gradient(to right, #000 80%, transparent 100%);
`;

const BlockWrap = styled.div`
  animation: ${enter} 0.45s ${({ theme }) => theme.ease.out} both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Media = styled.div`
  aspect-ratio: 2 / 1;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.paperDeep};
  overflow: hidden;
  svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.teal};
    opacity: 0.55;
  }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  aspect-ratio: 2 / 1;
  ${Media} {
    aspect-ratio: auto;
  }
  ${Media}:first-child {
    grid-row: span 2;
    background: ${({ theme }) => theme.colors.teal};
    opacity: 0.45;
  }
`;

const Quote = styled.div`
  display: flex;
  gap: 10px;
  span {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 40px;
    line-height: 0.8;
    color: ${({ theme }) => theme.colors.tealInk};
  }
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  i {
    height: 14px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.paperDeep};
  }
  i:nth-child(-n + 3) {
    background: ${({ theme }) => theme.colors.line};
  }
`;

const Stocks = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  svg {
    flex: 1;
    height: 36px;
    fill: none;
    stroke: ${({ theme }) => theme.colors.tealInk};
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  b {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.tealInk};
  }
`;

const Timeline = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 6px 0;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: ${({ theme }) => theme.colors.line};
  }
  i {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.tealInk};
    background: #ffffff;
  }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Panel = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.line};
`;

const PanelTitle = styled.p`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Score = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  circle {
    fill: none;
    stroke-width: 4;
  }
  .track {
    stroke: ${({ theme }) => theme.colors.paperDeep};
  }
  .value {
    stroke: ${({ theme }) => theme.colors.tealInk};
    stroke-linecap: round;
    stroke-dasharray: 100;
    transition: stroke-dashoffset 0.6s ${({ theme }) => theme.ease.out};
  }
  strong {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 20px;
    font-variant-numeric: tabular-nums;
  }
`;

const Tags = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  li {
    padding: 3px 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.paperDeep};
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.tealInk};
  }
`;

const Check = styled.p<{ $warn: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  &::before {
    content: '';
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    ${({ $warn, theme }) =>
      $warn
        ? css`
            background: #e8a33d;
          `
        : css`
            background: ${theme.colors.mint};
          `}
  }
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
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out};
  span {
    color: ${({ theme }) => theme.colors.tealInk};
  }
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.paper};
    }
  }
  &[aria-pressed='false'] {
    color: ${({ theme }) => theme.colors.inkMuted};
  }
  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.tealInk};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.tealInk};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tealInk};
    outline-offset: 2px;
  }
`;

const Caption = styled.figcaption`
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;
