import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styled, { css, keyframes } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useLang } from './lang';
import useInView from './useInView';
import VideoPlayerMock from './VideoPlayerMock';

// Playery ZPR w karuzeli: mockupy playera wideo (poziom i pion).
// Jedno ujęcie naraz. Slajd z kilkoma klatkami (frames) przełącza je co
// FRAME_MS – zostaje na przyszłe slajdy radia z motywami stacji.

const TICK_MS = 100;
// Co ile slajd radia zmienia stację
const FRAME_MS = 1500;

type ShotId = 'player' | 'portrait';

interface Frame {
  src: string;
  brand?: string;
}

interface Shot {
  id: ShotId;
  // zamiast zrzutu: mockup UI playera zbudowany w kodzie,
  // z szerokością wzoru, do której skalują się kontrolki
  mock?: { designWidth: number };
  frames: Frame[];
  ratio: number;
  duration: number;
}

const SHOTS: Shot[] = [
  {
    id: 'player',
    mock: { designWidth: 932 },
    frames: [],
    ratio: 932 / 524,
    duration: 5000,
  },
  {
    id: 'portrait',
    mock: { designWidth: 360 },
    frames: [],
    ratio: 9 / 16,
    duration: 5000,
  },
];

const PlayersGallery = () => {
  const { copy } = useLang();
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.4 });
  // slajd i czas spędzony na nim zmieniają się razem
  const [{ index, elapsed }, setPos] = useState({ index: 0, elapsed: 0 });
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const swipeX = useRef<number | null>(null);

  const shot = SHOTS[index];
  // Najechanie albo fokus zatrzymuje przewijanie slajdów
  const running = inView && !paused && !reduced && !hold;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(
      () =>
        setPos((pos) =>
          pos.elapsed + TICK_MS >= SHOTS[pos.index].duration
            ? { index: (pos.index + 1) % SHOTS.length, elapsed: 0 }
            : { ...pos, elapsed: pos.elapsed + TICK_MS },
        ),
      TICK_MS,
    );
    return () => clearInterval(id);
  }, [running]);

  const go = (next: number) =>
    setPos({ index: (next + SHOTS.length) % SHOTS.length, elapsed: 0 });

  const frameOf = (s: Shot, i: number) =>
    i === index ? Math.floor(elapsed / FRAME_MS) % s.frames.length : 0;

  const progress = (i: number) => {
    if (i < index) return 1;
    if (i > index) return 0;
    return reduced ? 1 : Math.min(1, elapsed / shot.duration);
  };

  const brand = shot.frames[frameOf(shot, index)]?.brand;

  return (
    <Figure
      ref={ref}
      aria-roledescription="carousel"
      aria-label={copy.playersDemo}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') go(index - 1);
        if (event.key === 'ArrowRight') go(index + 1);
      }}
    >
      <Progress>
        {SHOTS.map(({ id }, i) => (
          <Segment
            key={id}
            type="button"
            aria-label={copy.playersSlide(i + 1, SHOTS.length)}
            aria-current={i === index}
            onClick={() => go(i)}
          >
            <Track>
              <Fill
                $now={i === index}
                style={{ transform: `scaleX(${progress(i)})` }}
              />
            </Track>
          </Segment>
        ))}
      </Progress>

      <Top>
        <Title>{copy.playersTitle}</Title>
        <Count aria-hidden="true">
          {copy.playersSlide(index + 1, SHOTS.length)}
        </Count>
      </Top>

      <Stage
        onPointerDown={(event) => {
          swipeX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeX.current === null) return;
          const dx = event.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
        }}
      >
        {SHOTS.map((s, i) => (
          <Slide
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={copy.playersSlide(i + 1, SHOTS.length)}
            aria-hidden={i !== index}
            $on={i === index}
          >
            <Screen style={{ '--ratio': s.ratio } as CSSProperties}>
              <Media shot={s} frame={frameOf(s, i)} />
            </Screen>
          </Slide>
        ))}
      </Stage>

      {/* Wszystkie podpisy w jednej komórce: wysokość bierze się z najdłuższego,
          więc zmiana slajdu nie przesuwa karty */}
      <Caption aria-live={running ? 'off' : 'polite'}>
        {SHOTS.map((s, i) => (
          <CaptionItem key={s.id} $on={i === index} aria-hidden={i !== index}>
            <Name>
              {copy.playersShots[s.id].title}
              {i === index && brand && <Brand key={brand}>{brand}</Brand>}
            </Name>
            <Text>{copy.playersShots[s.id].text}</Text>
          </CaptionItem>
        ))}
      </Caption>

      <Bottom>
        <Buttons>
          <Ctrl
            type="button"
            aria-label={copy.playersPrev}
            onClick={() => go(index - 1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12.5 4.5L7 10l5.5 5.5" />
            </svg>
          </Ctrl>
          {!reduced && (
            <Ctrl
              type="button"
              aria-label={paused ? copy.playersPlay : copy.playersPause}
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
            aria-label={copy.playersNext}
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

export default PlayersGallery;

// Mockup albo stos klatek, z których widać tylko bieżącą.
const Media = ({ shot, frame }: { shot: Shot; frame: number }) => {
  if (shot.mock) return <VideoPlayerMock designWidth={shot.mock.designWidth} />;

  return (
    <>
      {shot.frames.map(({ src }, i) => (
        <Img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          $on={i === frame}
        />
      ))}
    </>
  );
};

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const Figure = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 2.2vw, 30px);
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
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

const Track = styled.span`
  display: block;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(243, 246, 241, 0.22);
`;

const Fill = styled.span<{ $now: boolean }>`
  display: block;
  height: 100%;
  background: ${({ theme }) => theme.colors.mint};
  transform-origin: left;
  transition: ${({ $now }) => ($now ? `transform ${TICK_MS}ms linear` : 'none')};
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

// Scena o stałych proporcjach; ujęcie wpisuje się w nią jednostkami kontenera
const Stage = styled.div`
  position: relative;
  margin-top: clamp(14px, 2vw, 22px);
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.fieldDeep};
  container-type: size;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
`;

const Slide = styled.div<{ $on: boolean }>`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: scale(${({ $on }) => ($on ? 1 : 0.97)});
  visibility: ${({ $on }) => ($on ? 'visible' : 'hidden')};
  transition:
    opacity 0.5s ${({ theme }) => theme.ease.out},
    transform 0.6s ${({ theme }) => theme.ease.out},
    visibility 0.5s;
`;

const SCREEN_PAD = '24px';

const Screen = styled.div`
  position: relative;
  width: min(
    calc(100cqw - ${SCREEN_PAD} * 2),
    calc((100cqh - ${SCREEN_PAD} * 2) * var(--ratio))
  );
  aspect-ratio: var(--ratio);
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
`;

const mediaBase = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Img = styled.img<{ $on: boolean }>`
  ${mediaBase};
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.6s ${({ theme }) => theme.ease.out};
`;

const Caption = styled.div`
  display: grid;
  margin-top: 16px;
`;

const CaptionItem = styled.div<{ $on: boolean }>`
  grid-area: 1 / 1;
  visibility: ${({ $on }) => ($on ? 'visible' : 'hidden')};
  ${({ $on }) =>
    $on &&
    css`
      > * {
        animation: ${rise} 0.5s ${({ theme }) => theme.ease.out} both;
      }
      > :nth-child(2) {
        animation-delay: 70ms;
      }
    `}
`;

const Name = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.25;
`;

const Brand = styled.span`
  padding-left: 10px;
  border-left: 1px solid rgba(243, 246, 241, 0.28);
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mint};
  animation: ${rise} 0.4s ${({ theme }) => theme.ease.out} both;
`;

const Text = styled.p`
  margin-top: 6px;
  max-width: 46ch;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Bottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 20px;
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
