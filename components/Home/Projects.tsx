import styled from 'styled-components';
import type { Project, ProjectsSection } from '../../content/types';
import { useLang } from './lang';
import MapDemo from './MapDemo';
import { CmsInline, Section, SectionTitle, Wrap } from './ui';

// Case study na papierze: bez cieni i ramek, kolumny oddziela linia u góry
// (jak ściana stacku)
const Projects = ({ section }: { section: ProjectsSection }) => {
  const { copy } = useLang();
  const { intro, items } = section;
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);

  return (
    <Section id="projekty" aria-labelledby="projekty-title">
      <Wrap>
        <SectionTitle id="projekty-title">
          <CmsInline>{section.title}</CmsInline>
        </SectionTitle>
        {intro && <Intro>{intro}</Intro>}

        {featured.map((project) => (
          <Featured key={project.id} project={project} />
        ))}

        <Grid>
          {/* TODO(Moon): czwarta karta, projekt własny (np. dociekai.pl) – opis i link */}
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
      </Wrap>
    </Section>
  );
};

// Wyróżniony case study: opis po lewej, ilustracja mapy po prawej, liczby pod spodem
const Featured = ({ project }: { project: Project }) => {
  const { copy } = useLang();
  const { name, context, role, problem, text, facts, stack, link } = project;

  return (
    <FeaturedItem>
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
          <Label>{copy.projectWork}</Label>
          {text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Label>{copy.expStack}</Label>
          <p>{stack}</p>
        </Detail>
        {link && (
          <CaseLink href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <span aria-hidden="true">↗</span>
          </CaseLink>
        )}
      </FeaturedText>

      <FeaturedVisual>
        <MapDemo />
      </FeaturedVisual>

      {facts && (
        <Facts aria-label={copy.projectFacts}>
          {facts.map(({ value, label }) => (
            <Fact key={label}>
              <FactValue>{value}</FactValue>
              <FactLabel>{label}</FactLabel>
            </Fact>
          ))}
        </Facts>
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

const Item = styled.li`
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  padding-top: 18px;
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

const FeaturedItem = styled.article`
  margin-top: clamp(36px, 5vw, 56px);
  padding-top: 18px;
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedText = styled.div`
  ${Name} {
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
  }
  ${Detail} p + p {
    margin-top: 10px;
  }
`;

const FeaturedVisual = styled.div`
  min-width: 0;
`;

const CaseLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.mint};
  text-decoration-thickness: 3px;
  text-underline-offset: 0.3em;
  span {
    transition: transform 0.25s ${({ theme }) => theme.ease.out};
  }
  @media (hover: hover) {
    &:hover span {
      transform: translate(2px, -2px);
    }
  }
`;

const Facts = styled.dl`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 48px);
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Fact = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  padding-top: 14px;
`;

const FactValue = styled.dt`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(2.5rem, 4.5vw, 4rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.tealInk};
  font-variant-numeric: tabular-nums;
`;

const FactLabel = styled.dd`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.inkSoft};
`;
