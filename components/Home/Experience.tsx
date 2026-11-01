import styled, { css } from 'styled-components';
import type { ExperienceSection } from '../../content/types';
import { useLang } from './lang';
import { CmsInline, Section, SectionTitle, Wrap, bulletList } from './ui';
import useInView from './useInView';

const Experience = ({ section }: { section: ExperienceSection }) => {
  const { copy } = useLang();
  const { intro, entries } = section;
  const [lineRef, inView] = useInView<HTMLOListElement>({ threshold: 0.25 });

  return (
    <Section id="doswiadczenie" aria-labelledby="doswiadczenie-title">
      <Wrap>
        <Head>
          <SectionTitle id="doswiadczenie-title">
            <CmsInline>{section.title}</CmsInline>
          </SectionTitle>
          {intro && <Intro>{intro}</Intro>}
        </Head>

        <Timeline ref={lineRef} $in={inView} style={{ '--n': entries.length }}>
          {entries.map(({ period, role, text, projects, stack }, index) => (
            <Entry key={period}>
              <Dot aria-hidden="true" $current={index === 0} />
              <Period>{period}</Period>
              {role && <Role>{role}</Role>}
              <Detail>
                {text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {projects && (
                  <ul>
                    {projects.map((project) => (
                      <li key={project}>{project}</li>
                    ))}
                  </ul>
                )}
                {stack && (
                  <>
                    <Label>{copy.expStack}</Label>
                    {stack.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </>
                )}
              </Detail>
            </Entry>
          ))}
        </Timeline>
      </Wrap>
    </Section>
  );
};

export default Experience;

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 40px;
`;

const Intro = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Timeline = styled.ol<{ $in: boolean }>`
  position: relative;
  list-style: none;
  margin-top: clamp(36px, 5vw, 56px);
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  gap: clamp(20px, 2.6vw, 40px);

  /* linia osi czasu rysuje się od lewej, gdy sekcja wjedzie w widok */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 9px;
    height: 2px;
    background: ${({ theme }) => theme.colors.field};
    transform-origin: left;
    transform: scaleX(${({ $in }) => ($in ? 1 : 0)});
    transition: transform 1.4s ${({ theme }) => theme.ease.out};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    grid-template-columns: 1fr;
    gap: 0;
    padding-left: 32px;
    &::before {
      left: 9px;
      right: auto;
      top: 0;
      bottom: 0;
      width: 2px;
      height: auto;
      transform-origin: top;
      transform: scaleY(${({ $in }) => ($in ? 1 : 0)});
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transform: none;
      transition: none;
    }
  }
`;

const Entry = styled.li`
  position: relative;
  padding-top: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    padding: 0 0 36px;
  }
`;

const Dot = styled.span<{ $current: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.field};
  background: ${({ theme }) => theme.colors.paper};
  ${({ $current, theme: { colors } }) =>
    $current &&
    css`
      background: ${colors.mint};
      box-shadow: 0 0 0 6px rgba(143, 227, 136, 0.35);
    `}
  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    left: -32px;
    top: 6px;
  }
`;

const Period = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(1.6rem, 2.2vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.field};
  font-variant-numeric: tabular-nums;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Role = styled.h3`
  margin-top: 14px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1.15rem;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.colors.ink};
`;

const Detail = styled.div`
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.inkSoft};
  p + p,
  ul + p,
  p + ul {
    margin-top: 8px;
  }
  h4 ~ p,
  h4 ~ p + p {
    margin-top: 0;
  }
  ul {
    display: grid;
    gap: 6px;
  }
  ${bulletList}
`;

const Label = styled.h4`
  margin: 14px 0 2px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
  &::first-letter {
    text-transform: uppercase;
  }
`;
