import { useId, useState } from 'react';
import styled, { css } from 'styled-components';
import type { Project, ProjectsSection } from '../../content/types';
import EditorDemo from './EditorDemo';
import { useLang } from './lang';
import MapDemo from './MapDemo';
import MediaFacts from './MediaFacts';
import { CmsInline, Section, SectionTitle, Wrap } from './ui';

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

        {featured.map((project, index) => (
          <Featured key={project.id} project={project} flip={index % 2 === 1} />
        ))}

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
  players: MediaFacts,
};

// Wyróżniony case study: opis z liczbami obok ilustracji (co drugi na odwrót).
// Domyślnie widać rolę, problem i pierwszy akapit pracy; resztę rozwija przycisk.
const Featured = ({ project, flip }: { project: Project; flip: boolean }) => {
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
    <FeaturedItem $flip={flip}>
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
  padding-top: 18px;
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  display: grid;
  grid-template-columns: ${({ $flip }) =>
    $flip ? 'minmax(0, 5fr) minmax(0, 6fr)' : 'minmax(0, 6fr) minmax(0, 5fr)'};
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  & + & {
    margin-top: clamp(48px, 6vw, 88px);
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
