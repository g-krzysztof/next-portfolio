'use client';

import styled from 'styled-components';
import type { About as AboutContent, StackGroup } from '../../content/types';
import { useLang } from './lang';
import { lineLabel } from './stack';
import { CmsInline, Section, SectionTitle, Wrap } from './ui';

interface AboutStackProps {
  about: AboutContent;
  groups: StackGroup[];
  // ton naprzemienny z sąsiadami: głęboki papier, gdy wyżej nie ma projektów
  tone?: 'deep';
}

const AboutStack = ({ about, groups, tone }: AboutStackProps) => {
  const { copy } = useLang();
  const [current, ...others] = groups;

  return (
    <Section id="o-mnie" $tone={tone} aria-labelledby="o-mnie-title">
      <Grid>
        <About>
          <SectionTitle id="o-mnie-title">{copy.aboutTitle}</SectionTitle>
          <Body>
            <p>
              <CmsInline>{about.lead}</CmsInline>
            </p>
            {about.statement && (
              <Statement>
                <CmsInline>{about.statement}</CmsInline>
              </Statement>
            )}
            {about.body.map((paragraph) => (
              <p key={paragraph}>
                <CmsInline>{paragraph}</CmsInline>
              </p>
            ))}
          </Body>
        </About>

        {current && (
          <Wall aria-labelledby="stack-title">
            <WallTitle id="stack-title">{current.title}</WallTitle>
            <Words>
              {current.lines.flat().map(({ name, detail, strong, minor }) => (
                <li key={name}>
                  <Word $strong={strong} $minor={minor}>
                    {name}
                  </Word>
                  {detail && <Detail>{detail}</Detail>}
                </li>
              ))}
            </Words>
            {others.map(({ title, lines }) => (
              <Others key={title}>
                <WallTitle as="h4">{title}</WallTitle>
                <p>{lines.map(lineLabel).join(' · ')}</p>
              </Others>
            ))}
          </Wall>
        )}
      </Grid>
    </Section>
  );
};

export default AboutStack;

const Grid = styled(Wrap)`
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    grid-template-columns: 1fr;
  }
`;

const About = styled.div``;

const Body = styled.div`
  margin-top: 28px;
  max-width: 52ch;
  font-size: 1.08rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.inkSoft};
  p + p,
  h3 + p {
    margin-top: 14px;
  }
`;

const Statement = styled.h3`
  margin-top: 28px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.3rem, 2vw, 1.65rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.ink};
  text-wrap: balance;
`;

const Wall = styled.section`
  border-top: 2px solid ${({ theme }) => theme.colors.field};
  padding-top: 18px;
`;

const WallTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
`;

// Typograficzna ściana: technologie płyną jak tekst, rozdzielone miętową kropką
const Words = styled.ul`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 0;
  li {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
  }
  li:not(:last-child)::after {
    content: '';
    align-self: center;
    width: 7px;
    height: 7px;
    margin: 0 14px 0 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.teal};
  }
`;

const Word = styled.span<{ $strong?: boolean; $minor?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  line-height: 1.15;
  letter-spacing: -0.03em;
  ${({ $strong, $minor, theme }) =>
    $strong
      ? `
    font-weight: 800;
    font-size: clamp(1.8rem, 2.8vw, 3.4rem);
    color: ${theme.colors.field};
  `
      : $minor
        ? `
    font-weight: 500;
    font-size: clamp(1rem, 1.15vw, 1.3rem);
    letter-spacing: -0.01em;
    color: ${theme.colors.inkSoft};
  `
        : `
    font-weight: 600;
    font-size: clamp(1.2rem, 1.6vw, 1.9rem);
    color: ${theme.colors.tealInk};
  `}
`;

const Detail = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Others = styled.div`
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  p {
    margin-top: 6px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.inkSoft};
  }
`;
