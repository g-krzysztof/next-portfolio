'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import type { Project, ProjectsSection } from '../../content/types';
import EditorDemo from './EditorDemo';
import { useLang } from './lang';
import MapDemo from './MapDemo';
import PlayersGallery from './PlayersGallery';
import { CmsInline, Section, SectionTitle, Wrap, bulletList } from './ui';

// Case study na papierze: bez cieni i ramek, kolumny oddziela linia u góry
// (jak ściana stacku)
const Projects = ({ section }: { section: ProjectsSection }) => {
  const { copy } = useLang();
  const { intro, items } = section;
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);

  return (
    <Section id="projekty" $tone="deep" aria-labelledby="projekty-title">
      <Wrap>
        <SectionTitle id="projekty-title">
          <CmsInline>{section.title}</CmsInline>
        </SectionTitle>
        {intro && <Intro>{intro}</Intro>}

        {toBlocks(featured).map((block, index) => {
          const flip = index % 2 === 1;
          const [first] = block;
          return block.length > 1 || first.otherTasks ? (
            <Tabbed key={first.id} tabs={tabsFor(block, flip)} />
          ) : (
            <Featured key={first.id} project={first} flip={flip} />
          );
        })}

        {/* TODO(Moon): karta projektu własnego (np. dociekai.pl) – opis i link */}
        {rest.length > 0 && (
          <Grid>
            {rest.map(({ id, name, context, role, text, stack }) => (
              <Item key={id}>
                <Name>{name}</Name>
                <Context>{context}</Context>
                <Detail>
                  <Label>{copy.projectRole}</Label>
                  <p>{role}</p>
                  <Label>{copy.projectWork}</Label>
                  {text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <Label>{copy.expStack}</Label>
                  <p>{stack}</p>
                </Detail>
              </Item>
            ))}
          </Grid>
        )}
      </Wrap>
    </Section>
  );
};

const VISUALS: Record<string, (() => React.JSX.Element) | undefined> = {
  map: MapDemo,
  editor: EditorDemo,
  players: PlayersGallery,
};

// Wyróżniony case study: opis z liczbami obok ilustracji (co drugi na odwrót).
// Domyślnie widać rolę, problem i pierwszy akapit pracy; resztę rozwija przycisk.
// `anchored` daje kotwicę #<id> dla przycisków „Więcej” w doświadczeniu;
// projekt z kartami ma ją na wrapperze kart
const Featured = ({
  project,
  flip,
  anchored = true,
}: {
  project: Project;
  flip: boolean;
  anchored?: boolean;
}) => {
  const { copy } = useLang();
  const {
    name,
    context,
    role,
    problem,
    product,
    text,
    facts,
    factsSource,
    stack,
    links,
    visual,
  } = project;
  const Visual = visual && VISUALS[visual];
  const [open, setOpen] = useState(false);
  const moreId = useId();
  const [firstWork, ...restWork] = text;
  const hasMore = Boolean(product?.length) || restWork.length > 0;

  return (
    <FeaturedItem id={anchored ? project.id : undefined} $flip={flip}>
      <FeaturedText>
        <Name as="h3">{name}</Name>
        <Context>{context}</Context>
        <Detail>
          <Label>{copy.projectRole}</Label>
          <p>{role}</p>
          {problem && (
            <>
              <Label>{copy.projectProblem}</Label>
              <p>{problem}</p>
            </>
          )}
          {open && product && (
            <>
              <Label>{copy.projectProduct}</Label>
              {product.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </>
          )}
          <Label>{copy.projectWork}</Label>
          <p>{firstWork}</p>
          <div id={moreId}>
            {open &&
              restWork.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <Label>{copy.expStack}</Label>
          <p>{stack}</p>
        </Detail>
        <Actions>
          {hasMore && (
            <More
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={moreId}
            >
              {open ? copy.readLess : copy.projectMore}
            </More>
          )}
          {links?.map(({ href, label }) => (
            <CaseLink
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
              <span aria-hidden="true">↗</span>
            </CaseLink>
          ))}
        </Actions>
        {facts && (
          <FactsWrap>
            <Facts aria-label={copy.projectFacts}>
              {facts.map(({ value, label }) => (
                <Fact key={label}>
                  <FactValue>{value}</FactValue>
                  <FactLabel>{label}</FactLabel>
                </Fact>
              ))}
            </Facts>
            {factsSource && <FactsSource>{factsSource}</FactsSource>}
          </FactsWrap>
        )}
      </FeaturedText>

      {Visual && (
        <FeaturedVisual>
          <Visual />
        </FeaturedVisual>
      )}
    </FeaturedItem>
  );
};

interface TabItem {
  // kotwica przycisku „Więcej” z doświadczenia, zarazem klucz karty
  anchor: string;
  label: string;
  content: React.ReactNode;
}

// Kolejne wyróżnione projekty: z tą samą `group` trafiają do jednego bloku z kartami,
// projekt z `otherTasks` dostaje drugą kartę z pozostałymi zadaniami.
// Bez kart zostaje zwykły case study.
const toBlocks = (featured: Project[]) => {
  const blocks: Project[][] = [];
  featured.forEach((project) => {
    const last = blocks[blocks.length - 1];
    if (project.group && last?.[0].group === project.group) last.push(project);
    else blocks.push([project]);
  });
  return blocks;
};

const tabsFor = (projects: Project[], flip: boolean): TabItem[] =>
  projects.flatMap((project) => [
    {
      anchor: project.id,
      label: project.tab ?? project.name,
      content: <Featured project={project} flip={flip} anchored={false} />,
    },
    ...(project.otherTasks
      ? [
          {
            anchor: `${project.id}-inne`,
            label: project.otherTasks.tab,
            content: <OtherTasks project={project} />,
          },
        ]
      : []),
  ]);

// Pozostałe zadania z tego samego miejsca pracy: kontekst i lista w dwóch kolumnach
const OtherTasks = ({ project }: { project: Project }) => (
  <OtherPanel>
    <Context>{project.context}</Context>
    <TaskList>
      {project.otherTasks?.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </TaskList>
  </OtherPanel>
);

// Karty nad linią oddzielającą. Kotwica karty w adresie (przyciski „Więcej”
// w doświadczeniu) przewija do bloku i otwiera tę kartę.
const Tabbed = ({ tabs }: { tabs: TabItem[] }) => {
  const { copy } = useLang();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const anchors = tabs.map(({ anchor }) => anchor).join(' ');

  useEffect(() => {
    const list = anchors.split(' ');
    const sync = () => {
      const index = list.indexOf(window.location.hash.slice(1));
      if (index >= 0) setActive(index);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [anchors]);

  // strzałki przełączają karty (wzorzec ARIA tabs)
  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <TabbedWrap>
      {tabs.map(({ anchor }) => (
        <Anchor key={anchor} id={anchor} />
      ))}
      <TabList role="tablist" aria-label={copy.projectTabs}>
        {tabs.map(({ anchor, label }, index) => (
          <Tab
            key={anchor}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${anchor}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${anchor}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
          >
            {label}
          </Tab>
        ))}
      </TabList>
      {tabs.map(({ anchor, content }, index) => (
        <div
          key={anchor}
          role="tabpanel"
          id={`${baseId}-panel-${anchor}`}
          aria-labelledby={`${baseId}-tab-${anchor}`}
          hidden={index !== active}
        >
          {content}
        </div>
      ))}
    </TabbedWrap>
  );
};

export default Projects;

const Intro = styled.p`
  margin-top: 18px;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Grid = styled.ul`
  list-style: none;
  margin-top: clamp(36px, 5vw, 56px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: clamp(28px, 3vw, 48px);
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.3rem, 2vw, 1.65rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.ink};
  text-wrap: balance;
`;

const Context = styled.p`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
`;

const Detail = styled.div`
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Label = styled.h4`
  margin: 14px 0 2px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
`;

const Item = styled.li`
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  padding-top: 18px;
  ${Detail} {
    max-width: 68ch;
  }
`;

const FeaturedItem = styled.article<{ $flip: boolean }>`
  margin-top: clamp(36px, 5vw, 56px);
  scroll-margin-top: calc(${({ theme }) => theme.layout.navHeight} + 24px);
  padding-top: 18px;
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  display: grid;
  grid-template-columns: ${({ $flip }) =>
    $flip ? 'minmax(0, 5fr) minmax(0, 6fr)' : 'minmax(0, 6fr) minmax(0, 5fr)'};
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  & + &,
  ${() => TabbedWrap} + & {
    margin-top: clamp(48px, 6vw, 88px);
  }
  /* w karcie linia jest podstawą zakładek, odstęp daje TabbedWrap */
  [role='tabpanel'] > & {
    margin-top: 0;
  }
  ${({ $flip }) =>
    $flip &&
    css`
      > :nth-child(2) {
        grid-row: 1;
        grid-column: 1;
      }
    `}
  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    grid-template-columns: 1fr;
    > :nth-child(2) {
      grid-row: auto;
      grid-column: auto;
    }
  }
`;

const TabbedWrap = styled.div`
  margin-top: clamp(36px, 5vw, 56px);
  scroll-margin-top: calc(${({ theme }) => theme.layout.navHeight} + 24px);
  & + & {
    margin-top: clamp(48px, 6vw, 88px);
  }
`;

// zakładki stoją na linii oddzielającej: aktywna pogrubia ją pod sobą
// kotwice kart: wszystkie na początku bloku, nad zakładkami
const Anchor = styled.span`
  display: block;
  scroll-margin-top: calc(${({ theme }) => theme.layout.navHeight} + 24px);
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 clamp(20px, 2.5vw, 36px);
  margin-bottom: -2px;
`;

const Tab = styled.button`
  position: relative;
  min-height: 48px;
  padding: 0 2px 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.colors.inkMuted};
  transition: color 0.25s ${({ theme }) => theme.ease.out};
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    border-radius: 99px 99px 0 0;
    background: ${({ theme }) => theme.colors.mint};
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.25s ${({ theme }) => theme.ease.out};
  }
  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.ink};
    }
  }
  &[aria-selected='true'] {
    color: ${({ theme }) => theme.colors.ink};
    &::after {
      transform: scaleY(1);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    &,
    &::after {
      transition: none;
    }
  }
`;

const OtherPanel = styled.div`
  padding-top: 18px;
  border-top: 2px solid ${({ theme }) => theme.colors.field};
`;

const TaskList = styled.ul`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: 14px clamp(28px, 4vw, 64px);
  font-size: 16px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.inkSoft};
  ${bulletList}
`;

const FeaturedText = styled.div`
  ${Name} {
    font-size: clamp(1.6rem, 2.6vw, 2.25rem);
  }
  ${Detail} {
    max-width: 68ch;
  }
  ${Detail} p + p,
  ${Detail} p + div > p {
    margin-top: 10px;
  }
`;

const FeaturedVisual = styled.div`
  min-width: 0;
`;

// liczby w kolumnie tekstu, obok ilustracji, więc nie dokładają osobnego rzędu
const FactsWrap = styled.div`
  margin-top: clamp(24px, 2.5vw, 36px);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 28px;
  margin-top: 18px;
`;

const More = styled.button`
  min-height: 40px;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.tealInk};
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
`;

const CaseLink = styled.a`
  padding-block: 8px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.mint};
  text-decoration-thickness: 3px;
  text-underline-offset: 0.3em;
  span {
    display: inline-block;
    margin-left: 8px;
    transition: transform 0.25s ${({ theme }) => theme.ease.out};
  }
  @media (hover: hover) {
    &:hover span {
      transform: translate(2px, -2px);
    }
  }
`;

const FactsSource = styled.p`
  margin-top: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px clamp(20px, 2.5vw, 36px);
`;

const Fact = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  column-gap: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  padding-top: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const FactValue = styled.dt`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  line-height: 1;
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.tealInk};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const FactLabel = styled.dd`
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.inkSoft};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    margin-top: 6px;
  }
`;
