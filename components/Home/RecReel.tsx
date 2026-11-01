import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Recommendation, RecommendationReel } from '../../content/types';
import type { Copy } from './copy';
import { LineIcon } from './icons';

type Scene =
  | { kind: 'intro' }
  | { kind: 'quote'; text: string; mark?: string }
  | { kind: 'fact'; value: string; label: string }
  | { kind: 'closing'; text: string };

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

// Czas sceny rośnie z liczbą słów, żeby dało się przeczytać do końca
const duration = (scene: Scene) => {
  switch (scene.kind) {
    case 'intro':
      return 2600;
    case 'fact':
      return 3200;
    case 'quote':
      return Math.min(6400, 1800 + words(scene.text) * 300);
    case 'closing':
      return Math.min(7000, 2400 + words(scene.text) * 280);
  }
};

const buildScenes = (reel: RecommendationReel): Scene[] => [
  { kind: 'intro' },
  ...reel.quotes.map((q) => ({ kind: 'quote' as const, ...q })),
  ...(reel.fact ? [{ kind: 'fact' as const, ...reel.fact }] : []),
  { kind: 'closing', text: reel.closing },
];

// Tekst wchodzi słowo po słowie; fragment `mark` dostaje miętę i podkreślenie
const Words = ({
  text,
  mark,
  from = 0,
}: {
  text: string;
  mark?: string;
  from?: number;
}) => {
  const at = mark ? text.indexOf(mark) : -1;
  const parts =
    at < 0
      ? [{ text, marked: false }]
      : [
          { text: text.slice(0, at), marked: false },
          { text: mark as string, marked: true },
          { text: text.slice(at + (mark as string).length), marked: false },
        ];
  let i = from;
  return (
    <>
      {parts.map((part, p) => {
        const tokens = part.text.split(/(\s+)/).filter(Boolean);
        const out = tokens.map((token, t) =>
          /^\s+$/.test(token) ? (
            ' '
          ) : (
            <Word key={t} style={{ '--i': i++ } as CSSProperties}>
              {token}
            </Word>
          ),
        );
        return part.marked ? (
          <Mark key={p} style={{ '--i': i } as CSSProperties}>
            {out}
          </Mark>
        ) : (
          <span key={p}>{out}</span>
        );
      })}
    </>
  );
};

const SceneView = ({
  scene,
  item,
  copy,
}: {
  scene: Scene;
  item: Recommendation;
  copy: Copy;
}) => {
  switch (scene.kind) {
    case 'intro':
      return (
        <Intro>
          <Glyph aria-hidden="true">“</Glyph>
          <IntroLine>
            <Words text={`${item.author.split(' ')[0]} ${copy.reelAbout}`} />
          </IntroLine>
          <Company>{item.company}</Company>
        </Intro>
      );
    case 'quote':
      return (
        <Line>
          <Words text={scene.text} mark={scene.mark} />
        </Line>
      );
    case 'fact':
      return (
        <Fact>
          <Value $long={scene.value.length > 10}>{scene.value}</Value>
          <FactLabel>
            <Words text={scene.label} from={4} />
          </FactLabel>
        </Fact>
      );
    case 'closing':
      return (
        <Closing>
          <Line>
            <Words text={scene.text} />
          </Line>
          <Signature style={{ '--i': words(scene.text) } as CSSProperties}>
            {item.author}
          </Signature>
        </Closing>
      );
  }
};

interface RecReelProps {
  item: Recommendation;
  reel: RecommendationReel;
  active: boolean;
  playing: boolean;
  onTogglePlay: (play: boolean) => void;
  onEnded: () => void;
  copy: Copy;
}

const RecReel = ({
  item,
  reel,
  active,
  playing,
  onTogglePlay,
  onEnded,
  copy,
}: RecReelProps) => {
  const scenes = buildScenes(reel);
  const [scene, setScene] = useState(0);
  // licznik przebiegów: zmiana klucza restartuje animacje tej samej sceny
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const heldRef = useRef(false);

  const running = active && playing && !held && !ended;

  // pierwsze odtworzenie zdejmuje plakat (stan dopasowany w renderze, bez efektu)
  if (running && !started) setStarted(true);

  const goTo = (next: number) => {
    if (next >= scenes.length) {
      setEnded(true);
      onEnded();
      return;
    }
    setEnded(false);
    setScene(Math.max(0, next));
    setRun((r) => r + 1);
  };

  const replay = () => {
    setEnded(false);
    setScene(0);
    setRun((r) => r + 1);
    onTogglePlay(true);
  };

  // Tap w lewą część cofa scenę, w prawą przewija dalej;
  // przytrzymanie zatrzymuje rolkę jak w stories
  const releaseHold = () => {
    window.clearTimeout(holdTimer.current);
    if (heldRef.current) setHeld(false);
  };

  const onScreenClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    if (heldRef.current) {
      heldRef.current = false;
      return;
    }
    if (!started) {
      onTogglePlay(true);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    goTo(event.clientX - rect.left < rect.width * 0.35 ? scene - 1 : scene + 1);
  };

  const button = ended
    ? { icon: 'flip' as const, label: copy.reelReplay, action: replay }
    : playing
      ? {
          icon: 'pause' as const,
          label: copy.reelPause,
          action: () => onTogglePlay(false),
        }
      : {
          icon: 'play' as const,
          label: copy.reelPlay,
          action: () => onTogglePlay(true),
        };

  const poster = !started;
  const current = scenes[scene];

  return (
    <Screen
      data-running={running}
      onClick={onScreenClick}
      onPointerDown={() => {
        if (!active || !started) return;
        heldRef.current = false;
        holdTimer.current = window.setTimeout(() => {
          heldRef.current = true;
          setHeld(true);
        }, 220);
      }}
      onPointerUp={releaseHold}
      onPointerLeave={releaseHold}
      onPointerCancel={releaseHold}
      $active={active}
    >
      <Progress aria-hidden="true">
        {scenes.map((s, index) => (
          <Segment key={index}>
            {index === scene && started ? (
              <Fill
                key={run}
                style={{ animationDuration: `${duration(s)}ms` }}
                onAnimationEnd={() => goTo(scene + 1)}
                $run
              />
            ) : (
              <Fill $full={index < scene || ended} />
            )}
          </Segment>
        ))}
      </Progress>

      <Stage aria-hidden="true" $static={poster} key={poster ? 'poster' : run}>
        {poster ? (
          <SceneView
            scene={scenes.find((s) => s.kind === 'quote') ?? current}
            item={item}
            copy={copy}
          />
        ) : (
          <SceneView scene={current} item={item} copy={copy} />
        )}
      </Stage>

      {poster && (
        <Poster aria-hidden="true">
          <LineIcon name="play" size={26} />
        </Poster>
      )}

      {active && (
        <Toggle
          type="button"
          aria-label={button.label}
          onClick={(event) => {
            event.stopPropagation();
            button.action();
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <LineIcon name={button.icon} size={18} />
        </Toggle>
      )}
    </Screen>
  );
};

export default RecReel;

const wordIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.55em);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.6) rotate(-8deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.06) rotate(1deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const underline = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const grow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Screen = styled.div<{ $active: boolean }>`
  position: relative;
  margin-top: 18px;
  height: clamp(290px, 25vw, 340px);
  border-radius: 18px;
  overflow: hidden;
  background:
    radial-gradient(
      120% 90% at 100% 0%,
      rgba(143, 227, 136, 0.16),
      transparent 60%
    ),
    ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-x pan-y;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'inherit')};

  &[data-running='false'] *,
  &[data-running='false'] *::after {
    animation-play-state: paused;
  }
`;

const Progress = styled.div`
  position: absolute;
  inset: 14px 16px auto;
  display: flex;
  gap: 5px;
  z-index: 2;
`;

const Segment = styled.span`
  flex: 1;
  height: 3px;
  border-radius: 3px;
  background: rgba(243, 246, 241, 0.22);
  overflow: hidden;
`;

const Fill = styled.span<{ $run?: boolean; $full?: boolean }>`
  display: block;
  height: 100%;
  background: ${({ theme }) => theme.colors.mint};
  transform-origin: left;
  transform: scaleX(${({ $full }) => ($full ? 1 : 0)});
  ${({ $run }) =>
    $run &&
    css`
      animation: ${grow} linear both;
    `}
`;

const Stage = styled.div<{ $static: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px 56px;

  ${({ $static }) =>
    $static &&
    css`
      opacity: 0.55;
      && *,
      && *::after {
        animation: none;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    && *,
    && *::after {
      animation: none;
    }
  }
`;

const Word = styled.span`
  display: inline-block;
  animation: ${wordIn} 0.6s ${({ theme }) => theme.ease.out} both;
  animation-delay: calc(var(--i) * 75ms + 120ms);
`;

const Mark = styled.span`
  position: relative;
  color: ${({ theme }) => theme.colors.mint};
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.06em;
    height: 0.09em;
    border-radius: 0.1em;
    background: currentColor;
    transform-origin: left;
    animation: ${underline} 0.7s ${({ theme }) => theme.ease.out} both;
    animation-delay: calc(var(--i) * 75ms + 500ms);
  }
`;

const Line = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.25rem, 1.75vw, 1.65rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  text-wrap: balance;
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Glyph = styled.span`
  display: block;
  height: 0.6em;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 6rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.mint};
  transform-origin: 20% 60%;
  animation: ${popIn} 0.8s ${({ theme }) => theme.ease.out} both;
`;

const IntroLine = styled(Line)`
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  font-weight: 800;
`;

const Company = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
  animation: ${wordIn} 0.6s ${({ theme }) => theme.ease.out} 0.6s both;
`;

const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Value = styled.strong<{ $long: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: ${({ $long }) =>
    $long ? 'clamp(1.6rem, 2.3vw, 2.1rem)' : 'clamp(3rem, 5vw, 4.5rem)'};
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.mint};
  transform-origin: left center;
  text-wrap: balance;
  animation: ${popIn} 0.8s ${({ theme }) => theme.ease.out} both;
`;

const FactLabel = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Closing = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Signature = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mint};
  animation: ${wordIn} 0.6s ${({ theme }) => theme.ease.out} both;
  animation-delay: calc(var(--i) * 75ms + 400ms);
  &::before {
    content: '– ';
  }
`;

const Poster = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.ink};
  box-shadow: 0 16px 30px -12px rgba(3, 18, 17, 0.8);
  svg {
    fill: currentColor;
    margin-left: 3px;
  }
`;

const Toggle = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(243, 246, 241, 0.32);
  color: ${({ theme }) => theme.colors.onField};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.mint};
      border-color: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.ink};
    }
  }
`;
