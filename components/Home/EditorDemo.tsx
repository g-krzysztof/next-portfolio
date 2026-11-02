import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLang } from './lang';

// Ilustracja szablonu Scrollytelling w edytorze WP: drzewiasta struktura treści
// (kontener, sekcje do 4 kolumn) w aplikacji zbudowanej dla płaskiej listy bloków.
// Widok „Zapis do API” pokazuje, jak adapter spłaszcza drzewo przy zapisie.
// Treść jest zmyślona, liczy się sam pomysł interfejsu.

type Part = 'image' | 'text' | 'quote';

interface Section {
  id: number;
  cols: number;
}

const COLUMNS = [1, 2, 3, 4];
const MAX_SECTIONS = 3;
const PARTS: Part[] = ['image', 'text', 'quote'];

// Stały, ale zróżnicowany układ bloków w kolumnach
const partAt = (sectionIndex: number, col: number) =>
  PARTS[(sectionIndex + col) % PARTS.length];

const EditorDemo = () => {
  const { copy } = useLang();
  const [sections, setSections] = useState<Section[]>([
    { id: 1, cols: 2 },
    { id: 2, cols: 1 },
  ]);
  const [active, setActive] = useState(1);
  const [flat, setFlat] = useState(false);
  const [saving, setSaving] = useState(false);
  const nextId = useRef(3);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const save = () => {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaving(false), 900);
  };

  const setCols = (cols: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === active ? { ...section, cols } : section,
      ),
    );
    save();
  };

  const addSection = () => {
    const id = nextId.current;
    nextId.current += 1;
    setSections((prev) => [...prev, { id, cols: 2 }]);
    setActive(id);
    save();
  };

  const removeSection = () => {
    const rest = sections.filter(({ id }) => id !== active);
    setSections(rest);
    setActive(rest[rest.length - 1].id);
    save();
  };

  const current = sections.find(({ id }) => id === active) ?? sections[0];
  const names = copy.editorNodes;
  const sectionName = (index: number) => `${names.section} ${index + 1}`;

  // Płaska lista, którą adapter wysyła do API: każdy węzeł zna tylko rodzica
  const rows = [
    { id: 'c1', parent: '–', type: names.container },
    ...sections.flatMap((section, index) => [
      { id: `s${index + 1}`, parent: 'c1', type: names.section },
      ...Array.from({ length: section.cols }, (_, col) => ({
        id: `s${index + 1}.${col + 1}`,
        parent: `s${index + 1}`,
        type: names[partAt(index, col)],
      })),
    ]),
  ];

  return (
    <Figure>
      <Bar>
        <Template>
          {copy.editorTemplate}: <strong>Scrollytelling</strong>
        </Template>
        <Status role="status" $saving={saving}>
          <span aria-hidden="true" />
          {saving ? copy.editorSaving : copy.editorSaved}
        </Status>
      </Bar>

      <Body>
        <Canvas aria-hidden="true">
          <Headline />
          <Headline $short />
          <Container>
            <NodeTag>{names.container}</NodeTag>
            {sections.map((section, index) => (
              <SectionBox
                key={section.id}
                $active={section.id === current.id}
                $cols={section.cols}
                onClick={() => setActive(section.id)}
              >
                <NodeTag>{sectionName(index)}</NodeTag>
                {Array.from({ length: section.cols }, (_, col) => (
                  <Column key={`${section.cols}-${col}`}>
                    <PartView part={partAt(index, col)} />
                  </Column>
                ))}
              </SectionBox>
            ))}
          </Container>
        </Canvas>

        <Side>
          <PanelTitle>{flat ? copy.editorFlat : copy.editorTree}</PanelTitle>
          {flat ? (
            <>
              <Flat>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>parent</th>
                    <th>{copy.editorType}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.parent}</td>
                      <td>{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </Flat>
              <Note>{copy.editorFlatNote}</Note>
            </>
          ) : (
            <Tree>
              <li>
                <TreeNode as="span">{names.container}</TreeNode>
                <ul>
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <TreeNode
                        type="button"
                        aria-pressed={section.id === current.id}
                        onClick={() => setActive(section.id)}
                      >
                        {sectionName(index)}
                        <small>
                          {section.cols} {copy.editorColsShort}
                        </small>
                      </TreeNode>
                      <ul>
                        {Array.from({ length: section.cols }, (_, col) => (
                          <li key={col}>
                            <TreeLeaf>{names[partAt(index, col)]}</TreeLeaf>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            </Tree>
          )}
        </Side>
      </Body>

      <Controls>
        <Group
          role="group"
          aria-label={`${copy.editorColumns}: ${sectionName(
            sections.indexOf(current),
          )}`}
        >
          <GroupLabel>{copy.editorColumns}</GroupLabel>
          {COLUMNS.map((cols) => (
            <Chip
              key={cols}
              type="button"
              aria-pressed={current.cols === cols}
              onClick={() => setCols(cols)}
            >
              {cols}
            </Chip>
          ))}
        </Group>
        <Group role="group" aria-label={names.section}>
          <GroupLabel>{names.section}</GroupLabel>
          <Chip
            type="button"
            disabled={sections.length >= MAX_SECTIONS}
            onClick={addSection}
          >
            <span aria-hidden="true">+</span>
            {copy.editorAdd}
          </Chip>
          <Chip
            type="button"
            disabled={sections.length <= 1}
            onClick={removeSection}
          >
            <span aria-hidden="true">−</span>
            {copy.editorRemove}
          </Chip>
        </Group>
        <Group role="group" aria-label={copy.editorView}>
          <GroupLabel>{copy.editorView}</GroupLabel>
          <Chip
            type="button"
            aria-pressed={!flat}
            onClick={() => setFlat(false)}
          >
            {copy.editorTree}
          </Chip>
          <Chip type="button" aria-pressed={flat} onClick={() => setFlat(true)}>
            {copy.editorFlat}
          </Chip>
        </Group>
      </Controls>
      <Caption>{copy.demoCaption}</Caption>
    </Figure>
  );
};

export default EditorDemo;

// Schematyczne podglądy bloków w kolumnach
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
    case 'quote':
      return (
        <Quote>
          <span>„</span>
          <Lines $n={2} />
        </Quote>
      );
    default:
      return <Lines $n={4} />;
  }
};

const enter = keyframes`
  from { opacity: 0; transform: translateY(6px); }
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

const Template = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
  strong {
    color: ${({ theme }) => theme.colors.ink};
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
  grid-template-columns: minmax(0, 1fr) minmax(190px, 0.55fr);
  gap: 12px;
  padding: 12px;
  border-radius: calc(${({ theme }) => theme.radii.card} - 12px);
  background: ${({ theme }) => theme.colors.paper};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 330px;
  padding: 18px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.line};
`;

const Headline = styled.span<{ $short?: boolean }>`
  height: 14px;
  width: ${({ $short }) => ($short ? '58%' : '92%')};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.ink};
`;

const NodeTag = styled.span`
  position: absolute;
  top: -9px;
  left: 10px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  padding: 18px 10px 10px;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.colors.line};
`;

const SectionBox = styled.div<{ $active: boolean; $cols: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
  gap: 8px;
  padding: 16px 8px 8px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.tealInk : theme.colors.line)};
  box-shadow: ${({ $active, theme }) =>
    $active ? `inset 0 0 0 1px ${theme.colors.tealInk}` : 'none'};
  cursor: pointer;
  transition:
    border-color 0.25s ${({ theme }) => theme.ease.out},
    box-shadow 0.25s ${({ theme }) => theme.ease.out};
  animation: ${enter} 0.4s ${({ theme }) => theme.ease.out} both;
  ${NodeTag} {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.tealInk : theme.colors.inkMuted};
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Column = styled.div`
  min-width: 0;
  padding: 6px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.paper};
  animation: ${enter} 0.4s ${({ theme }) => theme.ease.out} both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Lines = styled.span<{ $n: number }>`
  display: block;
  width: 100%;
  height: ${({ $n }) => $n * 12 - 5}px;
  background: repeating-linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.line} 0 7px,
    transparent 7px 12px
  );
  mask: linear-gradient(to right, #000 80%, transparent 100%);
`;

const Media = styled.div`
  aspect-ratio: 2 / 1;
  border-radius: 6px;
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

const Quote = styled.div`
  display: flex;
  gap: 6px;
  span {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 28px;
    line-height: 0.8;
    color: ${({ theme }) => theme.colors.tealInk};
  }
`;

const Side = styled.div`
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

const Tree = styled.ul`
  list-style: none;
  font-size: 13px;
  ul {
    list-style: none;
    margin-left: 7px;
    padding-left: 10px;
    border-left: 1px solid ${({ theme }) => theme.colors.line};
  }
`;

const TreeNode = styled.button`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin: 2px 0;
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  small {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.inkMuted};
  }
  &:is(span) {
    cursor: default;
  }
  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.paperDeep};
    color: ${({ theme }) => theme.colors.tealInk};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tealInk};
    outline-offset: 1px;
  }
`;

const TreeLeaf = styled.span`
  display: block;
  padding: 2px 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Flat = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  th {
    padding: 0 4px 4px;
    text-align: left;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.inkMuted};
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }
  td {
    padding: 3px 4px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.paperDeep};
  }
  td:first-child {
    color: ${({ theme }) => theme.colors.tealInk};
    font-weight: 600;
  }
`;

const Note = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  justify-content: center;
  gap: 6px;
  min-width: 40px;
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
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.paper};
    }
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
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
