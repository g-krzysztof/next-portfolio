import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useLang } from './lang';
import useInView from './useInView';

// Liczby o wideo w sieci, odtwarzane jak relacja: pasek postępu, pauza,
// przewijanie. Każda liczba ma prosty wykres i zdanie, co znaczy dla playera.
// Wszystkie dane mają źródło pod spodem, bez szacunków.

const SLIDE_MS = 9000;

const MediaFacts = () => {
  const { copy } = useLang();
  const items = copy.factsItems;
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const running = inView && !paused && !hold && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % items.length),
      SLIDE_MS,
    );
    return () => clearTimeout(id);
  }, [running, index, items.length]);

  const go = (next: number) => setIndex((next + items.length) % items.length);

  const item = items[index];

  return (
    <Figure
      ref={ref}
      aria-roledescription="carousel"
      aria-label={copy.factsDemo}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <Progress>
        {items.map(({ value }, i) => (
          <Segment
            key={value}
            type="button"
            aria-label={copy.factsSlide(i + 1, items.length)}
            aria-current={i === index}
            onClick={() => go(i)}
          >
            <Fill
              $state={i < index ? 'done' : i === index ? 'now' : 'next'}
              $running={running}
              key={i === index ? `now-${index}` : i}
            />
          </Segment>
        ))}
      </Progress>

      <Top>
        <Title>{copy.factsTitle}</Title>
        <Count aria-hidden="true">
          {copy.factsSlide(index + 1, items.length)}
        </Count>
      </Top>

      <Slide
        key={index}
        role="group"
        aria-roledescription="slide"
        aria-label={copy.factsSlide(index + 1, items.length)}
      >
        <Value>{item.value}</Value>
        <Label>{item.label}</Label>
        <Chart item={item} />
        <Takeaway>
          <strong>{copy.factsInPractice}</strong>
          {item.takeaway}
        </Takeaway>
      </Slide>

      <Bottom>
        <Source>
          {copy.factsSource}: {item.source}
        </Source>
        <Buttons>
          <Ctrl
            type="button"
            aria-label={copy.factsPrev}
            onClick={() => go(index - 1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12.5 4.5L7 10l5.5 5.5" />
            </svg>
          </Ctrl>
          {!reduced && (
            <Ctrl
              type="button"
              aria-label={paused ? copy.factsPlay : copy.factsPause}
              onClick={() => setPaused(!paused)}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                {paused ? (
                  <path className="solid" d="M7 4.5v11l9-5.5z" />
                ) : (
                  <path d="M7.5 5v10M12.5 5v10" />
                )}
              </svg>
            </Ctrl>
          )}
          <Ctrl
            type="button"
            aria-label={copy.factsNext}
            onClick={() => go(index + 1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7.5 4.5L13 10l-5.5 5.5" />
            </svg>
          </Ctrl>
        </Buttons>
      </Bottom>
    </Figure>
  );
};

type Item = ReturnType<typeof useLang>['copy']['factsItems'][number];

// Wykres pod liczbą: ozdobny, bo tę samą informację niesie tekst obok
const Chart = ({ item }: { item: Item }) => {
  if (item.kind === 'share')
    return (
      <Cells aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <Cell
            key={i}
            $on={i < 15}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </Cells>
    );

  // 10 ekranów: 7 pełnych i ósmy w połowie, czyli przedział 70–80%
  if (item.kind === 'reels')
    return (
      <Phones aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <Phone
            key={i}
            $fill={i < 7 ? 'full' : i === 7 ? 'half' : 'none'}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </Phones>
    );

  // 50 ludzików, 17 z blokadą = 34%
  if (item.kind === 'adblock')
    return (
      <People aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => (
          <Person
            key={i}
            $on={i < 17}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <svg viewBox="0 0 16 22">
              <circle cx="8" cy="5" r="4" />
              <path d="M1 21v-4a7 7 0 0 1 14 0v4z" />
            </svg>
          </Person>
        ))}
      </People>
    );

  if (item.extra)
    return (
      <Extra>
        <strong>{item.extra.value}</strong>
        <span>{item.extra.label}</span>
      </Extra>
    );

  return null;
};

export default MediaFacts;

const WARN = '#F2A65A';

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
`;

const pop = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
`;

const Figure = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: clamp(520px, 44vw, 600px);
  padding: clamp(18px, 2.2vw, 30px);
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
    }
  }
`;

const Progress = styled.div`
  display: flex;
  gap: 6px;
`;

const Segment = styled.button`
  flex: 1;
  height: 24px;
  padding: 10px 0;
  background: none;
  border: 0;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.mint};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const fillUp = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Fill = styled.span<{
  $state: 'done' | 'now' | 'next';
  $running: boolean;
}>`
  display: block;
  height: 4px;
  border-radius: 2px;
  background: rgba(243, 246, 241, 0.22);
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.mint};
    transform-origin: left;
    transform: scaleX(${({ $state }) => ($state === 'done' ? 1 : 0)});
    ${({ $state, $running }) =>
      $state === 'now' &&
      css`
        animation: ${fillUp} ${SLIDE_MS}ms linear forwards;
        animation-play-state: ${$running ? 'running' : 'paused'};
      `}
  }
  @media (prefers-reduced-motion: reduce) {
    &::after {
      transform: scaleX(${({ $state }) => ($state === 'next' ? 0 : 1)});
    }
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-top: 14px;
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Count = styled.span`
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Slide = styled.div`
  flex: 1;
  margin-top: clamp(20px, 3vw, 36px);
  > * {
    animation: ${rise} 0.6s ${({ theme }) => theme.ease.out} both;
  }
  > :nth-child(2) {
    animation-delay: 80ms;
  }
  > :nth-child(3) {
    animation-delay: 160ms;
  }
  > :nth-child(4) {
    animation-delay: 240ms;
  }
`;

const Value = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(3.2rem, 6.5vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: ${({ theme }) => theme.colors.mint};
  font-variant-numeric: tabular-nums;
`;

const Label = styled.p`
  margin-top: 14px;
  max-width: 34ch;
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  line-height: 1.4;
  font-weight: 500;
  text-wrap: pretty;
`;

const Takeaway = styled.p`
  margin-top: clamp(20px, 2.5vw, 28px);
  padding-top: 14px;
  border-top: 1px solid rgba(243, 246, 241, 0.18);
  max-width: 46ch;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.onFieldSoft};
  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.mint};
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
`;

const Source = styled.p`
  font-size: 12px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.onFieldSoft};
  opacity: 0.85;
`;

const Buttons = styled.div`
  display: flex;
  gap: 6px;
  flex: none;
`;

const Ctrl = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(243, 246, 241, 0.28);
  background: transparent;
  color: ${({ theme }) => theme.colors.onField};
  cursor: pointer;
  transition: background-color 0.25s ${({ theme }) => theme.ease.out};
  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .solid {
    fill: currentColor;
    stroke: none;
  }
  @media (hover: hover) {
    &:hover {
      background: rgba(243, 246, 241, 0.1);
    }
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.mint};
    outline-offset: 2px;
  }
`;

// --- wykresy ---

const Cells = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 4px;
  margin-top: 22px;
  max-width: 420px;
`;

const Cell = styled.span<{ $on: boolean }>`
  height: 28px;
  border-radius: 4px;
  background: ${({ $on, theme }) =>
    $on ? theme.colors.mint : 'rgba(243, 246, 241, 0.16)'};
  animation: ${pop} 0.4s ${({ theme }) => theme.ease.out} both;
`;

const People = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px 5px;
  margin-top: 22px;
  max-width: 260px;
`;

const Phones = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 22px;
`;

const Phone = styled.span<{ $fill: 'full' | 'half' | 'none' }>`
  width: 24px;
  height: 42px;
  border-radius: 6px;
  border: 1.5px solid rgba(243, 246, 241, 0.3);
  background: ${({ $fill, theme }) =>
    $fill === 'full'
      ? theme.colors.mint
      : $fill === 'half'
        ? `linear-gradient(to top, ${theme.colors.mint} 50%, transparent 50%)`
        : 'transparent'};
  border-color: ${({ $fill, theme }) =>
    $fill === 'none' ? 'rgba(243, 246, 241, 0.3)' : theme.colors.mint};
  animation: ${pop} 0.4s ${({ theme }) => theme.ease.out} both;
`;

const Person = styled.span<{ $on: boolean }>`
  animation: ${pop} 0.4s ${({ theme }) => theme.ease.out} both;
  svg {
    display: block;
    width: 100%;
    max-width: 22px;
    fill: ${({ $on }) => ($on ? WARN : 'rgba(243, 246, 241, 0.2)')};
  }
`;

const Extra = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(243, 246, 241, 0.18);
  max-width: 460px;
  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 800;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    letter-spacing: -0.035em;
    color: ${({ theme }) => theme.colors.onField};
  }
  span {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.onFieldSoft};
  }
`;
