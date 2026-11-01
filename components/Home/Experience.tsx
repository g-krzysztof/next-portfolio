import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { ExperienceSection } from '../../content/types';
import { useLang } from './lang';
import { CmsInline, Section, SectionTitle, Wrap, bulletList } from './ui';
import useInView from './useInView';

// długość okresu w latach do plakietki na miniaturze; „obecnie” liczy się do bieżącego roku
const CURRENT_YEAR = new Date().getFullYear();
const periodYears = (period: string) => {
  const [start, end = CURRENT_YEAR] = (period.match(/\d{4}/g) ?? []).map(
    Number,
  );
  return start ? Math.max(end - start, 1) : 1;
};

// Oś czasu jako pasek przewijania playera: okresy to rozdziały, szkice to miniatury
// podglądu nad paskiem; aktywny jest rozdział pod kursorem (domyślnie bieżący).
const Experience = ({ section }: { section: ExperienceSection }) => {
  const { copy } = useLang();
  const { intro, entries } = section;
  const [lineRef, inView] = useInView<HTMLOListElement>({
    rootMargin: '0px 0px -25% 0px',
  });
  const [active, setActive] = useState(0);
  const last = entries.length - 1;

  return (
    <Section id="doswiadczenie" aria-labelledby="doswiadczenie-title">
      <Wrap>
        <Head>
          <SectionTitle id="doswiadczenie-title">
            <CmsInline>{section.title}</CmsInline>
          </SectionTitle>
          {intro && <Intro>{intro}</Intro>}
        </Head>

        <Timeline
          ref={lineRef}
          $in={inView}
          style={{ '--n': entries.length }}
          onPointerLeave={() => setActive(0)}
        >
          {entries.map(
            (
              { period, image, imageAlt, role, text, projects, stack, parts },
              index,
            ) => (
              <Entry
                key={period}
                style={{ gridColumn: index + 1 }}
                onPointerEnter={() => setActive(index)}
              >
                <Dot aria-hidden="true" $current={index === 0} />
                <Preview $active={index === active}>
                  {image && (
                    <Sketch
                      src={image}
                      alt={imageAlt ?? ''}
                      width={480}
                      height={480}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <Duration $active={index === active}>
                    {copy.expYears(periodYears(period))}
                  </Duration>
                </Preview>
                <Body>
                  <Period>{period}</Period>
                  {role && <Role>{role}</Role>}
                  <Detail>
                    {text?.map((paragraph) => (
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
                  {parts?.map((part) => (
                    <Part key={part.period}>
                      <PartPeriod>{part.period}</PartPeriod>
                      {part.role && <Role as="h4">{part.role}</Role>}
                      <Detail>
                        {part.text.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </Detail>
                    </Part>
                  ))}
                </Body>
              </Entry>
            ),
          )}
          <Seek aria-hidden="true">
            {entries.map(({ period }, index) => (
              <Chapter
                key={period}
                style={{ '--i': index }}
                $active={index === active}
                $last={index === last}
              />
            ))}
          </Seek>
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
  --gap: clamp(20px, 2.6vw, 40px);
  --drawn: ${({ $in }) => ($in ? 1 : 0)};
  /* początek rozdziału w kolumnie: kolumny i odstępy dzielą szerokość po równo */
  --step: calc((100% + var(--gap)) / var(--n));
  position: relative;
  list-style: none;
  margin-top: clamp(36px, 5vw, 56px);
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  grid-template-rows: auto 28px auto;
  gap: 14px var(--gap);

  /* na mobile oś jest pionowa: kreska po lewej, kropki przy okresach */
  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    display: block;
    padding-left: 32px;
    &::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: ${({ theme }) => theme.colors.field};
      transform-origin: top;
      transform: scaleY(var(--drawn));
      transition: transform 1.4s ${({ theme }) => theme.ease.out};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    --drawn: 1;
    &::before {
      transition: none;
    }
  }
`;

const Entry = styled.li`
  position: relative;
  display: grid;
  grid-row: 1 / span 3;
  grid-template-rows: subgrid;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    display: block;
    padding: 0 0 40px;
  }
`;

// miniatura podglądu jak nad paskiem playera; aktywna lekko się przybliża
const Preview = styled.div<{ $active: boolean }>`
  position: relative;
  grid-row: 1;
  aspect-ratio: 4 / 3;

  img {
    transform: scale(${({ $active }) => ($active ? 1.05 : 1)});
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    max-width: 240px;
    margin-bottom: 18px;
    img {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
`;

const Sketch = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  padding: 2% 4% 0;
  object-fit: contain;
  transition: transform 0.6s ${({ theme }) => theme.ease.out};
`;

// długość okresu w rogu miniatury, jak czas trwania wideo
const Duration = styled.span<{ $active: boolean }>`
  position: absolute;
  right: 4px;
  bottom: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.line : theme.colors.paperDeep};
  color: ${({ theme }) => theme.colors.field};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  transition: background-color 0.35s ${({ theme }) => theme.ease.out};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Body = styled.div`
  grid-row: 3;
  padding-top: 6px;
`;

// pasek przewijania: wspólny rząd siatki pod miniaturami, rysuje się od lewej raz
const Seek = styled.li`
  position: relative;
  grid-row: 2;
  grid-column: 1 / -1;
  clip-path: inset(-12px calc((1 - var(--drawn)) * 100%) -12px -12px);
  transition: clip-path 1.4s ${({ theme }) => theme.ease.out};

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// rozdział sięga od swojej kolumny do początku następnej, z 4px przerwą jak w YouTube
const Chapter = styled.span<{ $active: boolean; $last: boolean }>`
  position: absolute;
  top: 50%;
  left: calc(var(--i) * var(--step));
  width: calc(var(--step) - ${({ $last }) => ($last ? 'var(--gap)' : '4px')});
  height: 6px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.teal};
  transform: translateY(-50%);
  transition:
    height 0.35s ${({ theme }) => theme.ease.out},
    background-color 0.35s ${({ theme }) => theme.ease.out};
  ${({ $active, theme }) =>
    $active &&
    css`
      height: 10px;
      background: ${theme.colors.field};
    `}
`;

const Dot = styled.span<{ $current: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    display: block;
    position: absolute;
    top: 6px;
    left: -32px;
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

const Part = styled.div`
  margin-top: 14px;
  h4 {
    margin-top: 6px;
  }
  & + & {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
  }
`;

const PartPeriod = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.tealInk};
  font-variant-numeric: tabular-nums;
`;
