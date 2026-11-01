import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useLang } from './lang';

// Ilustracja playerów ZPR: wideo (preroll, LIVE, sticky, rolki), radio
// („teraz gramy” z okładkami i historią), podcast (odcinki, przewijanie,
// prędkość) i odsłuch artykułu (TTS z podświetlaniem czytanego zdania).
// Utwory, audycje i artykuł są zmyślone, liczy się sam pomysł interfejsu.

type Mode = 'video' | 'radio' | 'podcast' | 'tts';
type Phase = 'idle' | 'ad' | 'playing' | 'paused';
type Option = 'preroll' | 'live' | 'sticky' | 'vertical';

const MODES: Mode[] = ['video', 'radio', 'podcast', 'tts'];
const OPTIONS: Option[] = ['preroll', 'live', 'sticky', 'vertical'];
const AD_SECONDS = 4;
// co ile sekund radio „dostaje z API” kolejny utwór, a lektor kolejne zdanie
const TRACK_SECONDS = 6;
const SENTENCE_SECONDS = 3;
const SPEEDS = [1, 1.5, 2];
const PODCAST_START = 7 * 60 + 40;

const TRACKS = [
  { artist: 'Nocne Tramwaje', track: 'Światła miasta' },
  { artist: 'Mgła nad Odrą', track: 'Ostatni pociąg' },
  { artist: 'Ola i Lato', track: 'Na zawsze w lipcu' },
  { artist: 'DJ Kometa', track: 'Orbita 3' },
];

const at = <T,>(list: T[], index: number) =>
  list[((index % list.length) + list.length) % list.length];

const clock = (seconds: number) => {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

// Odtwarzanie z opcjonalną reklamą na start: odliczanie, potem treść
const usePlayback = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [adLeft, setAdLeft] = useState(AD_SECONDS);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  const reset = useCallback(() => {
    clearInterval(timer.current);
    setPhase('idle');
    setAdLeft(AD_SECONDS);
  }, []);

  const toggle = (withAd: boolean) => {
    if (phase === 'ad') return;
    if (phase === 'playing') return setPhase('paused');
    if (phase === 'paused' || !withAd) return setPhase('playing');
    setPhase('ad');
    setAdLeft(AD_SECONDS);
    timer.current = setInterval(() => {
      setAdLeft((left) => {
        if (left > 1) return left - 1;
        clearInterval(timer.current);
        setPhase('playing');
        return AD_SECONDS;
      });
    }, 1000);
  };

  return { phase, adLeft, toggle, reset };
};

const PlayerDemo = () => {
  const { copy } = useLang();
  const [mode, setMode] = useState<Mode>('video');
  const [options, setOptions] = useState<Record<Option, boolean>>({
    preroll: true,
    live: false,
    sticky: false,
    vertical: false,
  });
  const { phase, adLeft, toggle, reset } = usePlayback();
  // sekundy odtwarzania: z nich wynika utwór w radiu i zdanie lektora
  const [tick, setTick] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [elapsed, setElapsed] = useState(PODCAST_START);
  const [speed, setSpeed] = useState(0);
  const rate = SPEEDS[speed];
  const playing = phase === 'playing';

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setElapsed((e) => e + rate);
    }, 1000);
    return () => clearInterval(id);
  }, [playing, rate]);

  const restart = () => {
    reset();
    setTick(0);
  };

  // zmiana ustawień odświeża player, jak „Zastosuj” na stronie demo
  const switchMode = (next: Mode) => {
    setMode(next);
    restart();
  };
  const switchOption = (option: Option) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    restart();
  };
  const pickEpisode = (index: number) => {
    setEpisode(index);
    setElapsed(0);
    restart();
  };

  const sentence = Math.floor(tick / SENTENCE_SECONDS);
  const sentences = copy.ttsSentences;
  // lektor doczytał artykuł do końca: player wraca na start
  const readTime = sentences.length * SENTENCE_SECONDS;
  useEffect(() => {
    if (mode !== 'tts' || !playing) return undefined;
    const id = setTimeout(
      () => {
        reset();
        setTick(0);
      },
      Math.max(0, readTime - tick) * 1000,
    );
    return () => clearTimeout(id);
  }, [mode, playing, readTime, tick, reset]);

  const withAd = options.preroll && mode !== 'tts';
  const ad = phase === 'ad';
  const adClock = `0:0${adLeft}`;
  const status = ad
    ? `${copy.playerAd} ${adClock}`
    : playing
      ? (options.live && mode === 'video') || mode === 'radio'
        ? copy.playerLive
        : copy.playerPlaying
      : phase === 'paused'
        ? copy.playerPaused
        : copy.playerReady;
  const playLabel = playing ? copy.playerPause : copy.playerPlay;

  const trackIndex = Math.floor(tick / TRACK_SECONDS);
  const current = at(TRACKS, trackIndex);
  const show = copy.podcastEpisodes[episode];
  const total = show.minutes * 60;
  const position = Math.min(elapsed, total);
  const seek = (delta: number) =>
    setElapsed((e) => Math.max(0, Math.min(total, e + delta)));

  return (
    <Figure>
      <Bar>
        <Dots aria-hidden="true">
          <i />
          <i />
          <i />
        </Dots>
        <Status role="status" $phase={phase}>
          <span aria-hidden="true" />
          {status}
        </Status>
      </Bar>

      <Body aria-label={copy.playerDemo} role="group">
        {mode === 'video' ? (
          <Page $sticky={options.sticky}>
            {options.sticky && (
              <>
                <Headline />
                <Lines $n={6} />
              </>
            )}
            <Screen
              $vertical={options.vertical}
              $sticky={options.sticky}
              $phase={phase}
            >
              <Poster aria-hidden="true">
                <svg viewBox="0 0 120 60" preserveAspectRatio="none">
                  <path d="M0 60L34 26L58 46L80 30L120 60Z" />
                  <circle cx="92" cy="16" r="7" />
                </svg>
              </Poster>
              {phase === 'ad' && (
                <AdBadge>
                  {copy.playerAd} · 0:0{adLeft}
                </AdBadge>
              )}
              {options.live && phase !== 'ad' && (
                <LiveBadge $on={playing}>{copy.playerLiveBadge}</LiveBadge>
              )}
              <PlayButton
                type="button"
                onClick={() => toggle(withAd)}
                aria-label={playLabel}
                disabled={ad}
                $hidden={playing}
              >
                <PlayIcon $pause={playing} />
              </PlayButton>
              <Track aria-hidden="true">
                {phase === 'ad' ? (
                  <AdProgress key="ad" />
                ) : (
                  !options.live && <Progress key="content" $running={playing} />
                )}
              </Track>
            </Screen>
            {options.sticky && <Lines $n={4} />}
          </Page>
        ) : mode === 'radio' ? (
          <Stack>
            <RadioCard>
              <CoverWrap $size={140}>
                <Cover key={trackIndex} variant={trackIndex} />
                {ad && <AdBadge>{adClock}</AdBadge>}
              </CoverWrap>
              <div>
                <OnAir $on={playing}>
                  {copy.playerLiveBadge} · {copy.playerStation}
                </OnAir>
                <NowLabel>{ad ? copy.playerAdLock : copy.playerNow}</NowLabel>
                <NowTitle>
                  {ad ? `${copy.playerAd} · ${adClock}` : current.track}
                </NowTitle>
                <NowArtist>
                  {ad ? copy.playerStation : current.artist}
                </NowArtist>
                <Row>
                  <RoundButton
                    type="button"
                    onClick={() => toggle(withAd)}
                    aria-label={playLabel}
                    disabled={ad}
                  >
                    <PlayIcon $pause={playing} />
                  </RoundButton>
                  <Bars aria-hidden="true" $on={playing}>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </Bars>
                </Row>
              </div>
            </RadioCard>
            <ListTitle>{copy.playerHistory}</ListTitle>
            <List>
              {[1, 2].map((back) => {
                const { artist, track } = at(TRACKS, trackIndex - back);
                return (
                  <ListRow key={trackIndex - back} as="li">
                    <CoverWrap $size={44}>
                      <Cover variant={trackIndex - back} />
                    </CoverWrap>
                    <span>
                      <strong>{track}</strong>
                      {artist}
                    </span>
                  </ListRow>
                );
              })}
            </List>
          </Stack>
        ) : mode === 'podcast' ? (
          <Stack>
            <PodcastCard>
              <Episode>
                <CoverWrap $size={112}>
                  <Cover variant={episode + 4} />
                  {ad && <AdBadge>{adClock}</AdBadge>}
                </CoverWrap>
                <div>
                  <Show>{copy.podcastShow}</Show>
                  <EpisodeTitle>
                    {ad ? `${copy.playerAd} · ${adClock}` : show.title}
                  </EpisodeTitle>
                  <Meta>
                    {copy.playerEpisode} {12 - episode} · {show.minutes} min
                  </Meta>
                </div>
              </Episode>
              <Scrubber aria-hidden="true">
                <span>
                  <i style={{ transform: `scaleX(${position / total})` }} />
                </span>
                <Times>
                  <span>{clock(position)}</span>
                  <span>-{clock(total - position)}</span>
                </Times>
              </Scrubber>
              <Transport>
                <Skip
                  type="button"
                  onClick={() => seek(-15)}
                  aria-label={copy.playerBack}
                  disabled={ad}
                >
                  -15
                </Skip>
                <RoundButton
                  type="button"
                  onClick={() => toggle(withAd)}
                  aria-label={playLabel}
                  disabled={ad}
                >
                  <PlayIcon $pause={playing} />
                </RoundButton>
                <Skip
                  type="button"
                  onClick={() => seek(30)}
                  aria-label={copy.playerForward}
                  disabled={ad}
                >
                  +30
                </Skip>
                <Speed
                  type="button"
                  onClick={() => setSpeed((speed + 1) % SPEEDS.length)}
                  aria-label={`${copy.playerSpeed}: ${rate}×`}
                >
                  {rate}×
                </Speed>
              </Transport>
            </PodcastCard>
            <List aria-label={copy.playerEpisodes}>
              {copy.podcastEpisodes.map(({ title, minutes }, index) => (
                <li key={title}>
                  <ListRow
                    as="button"
                    type="button"
                    aria-pressed={index === episode}
                    onClick={() => pickEpisode(index)}
                  >
                    <CoverWrap $size={44}>
                      <Cover variant={index + 4} />
                    </CoverWrap>
                    <span>
                      <strong>{title}</strong>
                      {minutes} min
                    </span>
                  </ListRow>
                </li>
              ))}
            </List>
          </Stack>
        ) : (
          <Article>
            <Show>{copy.ttsCategory}</Show>
            <ArticleTitle>{copy.ttsHeadline}</ArticleTitle>
            <Listen>
              <RoundButton
                type="button"
                onClick={() => toggle(false)}
                aria-label={playLabel}
                $small
              >
                <PlayIcon $pause={playing} />
              </RoundButton>
              <div>
                <strong>{copy.ttsListen}</strong>
                {copy.ttsDuration}
              </div>
              <Bars aria-hidden="true" $on={playing}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </Bars>
            </Listen>
            <p>
              {sentences.map((text, index) => (
                <Sentence
                  key={text}
                  $active={phase !== 'idle' && index === sentence}
                >
                  {text}{' '}
                </Sentence>
              ))}
            </p>
            <Lines $n={4} />
          </Article>
        )}
      </Body>

      <Controls>
        <Group role="group" aria-label={copy.playerType}>
          <GroupLabel>{copy.playerType}</GroupLabel>
          {MODES.map((item) => (
            <Chip
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => switchMode(item)}
            >
              {copy.playerModes[item]}
            </Chip>
          ))}
        </Group>
        {mode !== 'tts' && (
          <Group role="group" aria-label={copy.playerSettings}>
            <GroupLabel>{copy.playerSettings}</GroupLabel>
            {OPTIONS.filter(
              (option) => mode === 'video' || option === 'preroll',
            ).map((option) => (
              <Chip
                key={option}
                type="button"
                aria-pressed={options[option]}
                onClick={() => switchOption(option)}
              >
                {copy.playerOptions[option]}
              </Chip>
            ))}
          </Group>
        )}
      </Controls>
      <Caption>{copy.demoCaption}</Caption>
    </Figure>
  );
};

export default PlayerDemo;

const PlayIcon = ({ $pause }: { $pause: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {$pause ? (
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    ) : (
      <path d="M8 5.5v13l10.5-6.5z" />
    )}
  </svg>
);

// Okładki rysowane z palety strony: każdy utwór i odcinek ma swoją kompozycję
const AMBER = '#e8a33d';

const Cover = ({ variant }: { variant: number }) => (
  <CoverArt viewBox="0 0 100 100" aria-hidden="true">
    {at(COVERS, variant)}
  </CoverArt>
);

const COVERS = [
  <>
    <rect width="100" height="100" fill="#E3ECE7" />
    <circle cx="50" cy="44" r="26" fill="#8FE388" />
    <path d="M0 66h100v8H0zM0 80h100v8H0zM0 94h100v6H0z" fill="#0F3B3A" />
  </>,
  <>
    <rect width="100" height="100" fill="#50A3A2" />
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#10201F"
      strokeWidth="6"
    />
    <circle
      cx="50"
      cy="50"
      r="24"
      fill="none"
      stroke="#10201F"
      strokeWidth="6"
    />
    <circle cx="50" cy="50" r="8" fill="#F3F6F1" />
  </>,
  <>
    <rect width="100" height="100" fill={AMBER} />
    <path d="M0 100L38 42L62 74L78 54L100 82V100Z" fill="#0F3B3A" />
    <circle cx="72" cy="26" r="11" fill="#F3F6F1" />
  </>,
  <>
    <rect width="100" height="100" fill="#8FE388" />
    <path d="M-10 70L70 -10H100L-10 100Z" fill="#0F3B3A" />
    <path d="M30 110L110 30V60L60 110Z" fill="#23706F" />
  </>,
  <>
    <rect width="100" height="100" fill="#10201F" />
    <rect x="14" y="56" width="10" height="30" rx="5" fill="#8FE388" />
    <rect x="32" y="34" width="10" height="52" rx="5" fill="#8FE388" />
    <rect x="50" y="18" width="10" height="68" rx="5" fill="#50A3A2" />
    <rect x="68" y="44" width="10" height="42" rx="5" fill={AMBER} />
  </>,
  <>
    <rect width="100" height="100" fill="#E3ECE7" />
    <rect x="16" y="16" width="44" height="44" fill="#23706F" />
    <circle cx="64" cy="64" r="22" fill={AMBER} />
  </>,
  <>
    <rect width="100" height="100" fill="#23706F" />
    <path d="M0 64Q25 44 50 64T100 64V100H0Z" fill="#0F3B3A" />
    <path
      d="M0 46Q25 26 50 46T100 46"
      fill="none"
      stroke="#8FE388"
      strokeWidth="6"
    />
  </>,
];

const fill = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const bounce = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
`;

const pulse = keyframes`
  50% { opacity: 0.35; }
`;

const swap = keyframes`
  from { opacity: 0; transform: scale(0.96); }
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

const Dots = styled.span`
  display: flex;
  gap: 6px;
  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.line};
  }
`;

const Status = styled.span<{ $phase: Phase }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.inkMuted};
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $phase, theme }) =>
      $phase === 'ad'
        ? '#e8a33d'
        : $phase === 'playing'
          ? theme.colors.mint
          : theme.colors.line};
    transition: background-color 0.25s ${({ theme }) => theme.ease.out};
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: calc(${({ theme }) => theme.radii.card} - 12px);
  background: ${({ theme }) => theme.colors.paper};
`;

// w trybie sticky player zjeżdża do rogu nad treścią artykułu
const Page = styled.div<{ $sticky: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  min-height: 330px;
  ${({ $sticky, theme }) =>
    $sticky &&
    css`
      justify-content: flex-start;
      padding: 20px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid ${theme.colors.line};
    `}
`;

const Screen = styled.div<{
  $vertical: boolean;
  $sticky: boolean;
  $phase: Phase;
}>`
  position: relative;
  align-self: center;
  width: ${({ $vertical }) => ($vertical ? 'min(100%, 186px)' : '100%')};
  aspect-ratio: ${({ $vertical }) => ($vertical ? '9 / 16' : '16 / 9')};
  max-height: 330px;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  transition: width 0.5s ${({ theme }) => theme.ease.out};
  ${({ $sticky, $vertical }) =>
    $sticky &&
    css`
      position: absolute;
      right: 14px;
      bottom: 14px;
      width: ${$vertical ? '96px' : '46%'};
      border-radius: 10px;
      box-shadow: 0 12px 32px rgba(16, 32, 31, 0.28);
    `}
`;

const Poster = styled.div`
  position: absolute;
  inset: 0;
  svg {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.teal};
    opacity: 0.35;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
`;

const AdBadge = styled(Badge)`
  background: #e8a33d;
  color: ${({ theme }) => theme.colors.ink};
`;

const LiveBadge = styled(Badge)<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.fieldDeep};
  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e5484d;
    ${({ $on }) =>
      $on &&
      css`
        animation: ${pulse} 1.4s ease-in-out infinite;
      `}
  }
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

const PlayButton = styled.button<{ $hidden: boolean }>`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 0;
  background: ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.ink};
  cursor: pointer;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transition:
    opacity 0.25s ${({ theme }) => theme.ease.out},
    transform 0.25s ${({ theme }) => theme.ease.out};
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  &:disabled {
    opacity: 0;
    cursor: default;
  }
  // pauza pojawia się po najechaniu albo z klawiatury
  @media (hover: hover) {
    ${Screen}:hover &:not(:disabled) {
      opacity: 1;
    }
    &:hover {
      transform: scale(1.06);
    }
  }
  &:focus-visible {
    opacity: 1;
    outline: 2px solid ${({ theme }) => theme.colors.onField};
    outline-offset: 3px;
  }
`;

const Track = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(243, 246, 241, 0.25);
`;

const Progress = styled.span<{ $running: boolean }>`
  display: block;
  height: 100%;
  background: ${({ theme }) => theme.colors.mint};
  transform-origin: left;
  transform: scaleX(0);
  animation: ${fill} 24s linear infinite;
  animation-play-state: ${({ $running }) => ($running ? 'running' : 'paused')};
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: scaleX(${({ $running }) => ($running ? 0.4 : 0)});
  }
`;

const AdProgress = styled.span`
  display: block;
  height: 100%;
  background: #e8a33d;
  transform-origin: left;
  animation: ${fill} ${AD_SECONDS}s linear both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Headline = styled.span`
  height: 14px;
  width: 72%;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.ink};
`;

const Lines = styled.span<{ $n: number }>`
  display: block;
  width: 100%;
  height: ${({ $n }) => $n * 14 - 6}px;
  background: repeating-linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.line} 0 8px,
    transparent 8px 14px
  );
  mask: linear-gradient(to right, #000 80%, transparent 100%);
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 330px;
`;

const CoverWrap = styled.span<{ $size: number }>`
  position: relative;
  flex: none;
  display: block;
  width: ${({ $size }) => $size}px;
  aspect-ratio: 1;
  border-radius: ${({ $size }) => ($size > 60 ? 12 : 8)}px;
  overflow: hidden;
  ${AdBadge} {
    top: auto;
    bottom: 8px;
    left: 8px;
  }
`;

const CoverArt = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  animation: ${swap} 0.5s ${({ theme }) => theme.ease.out} both;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const RadioCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const OnAir = styled.p<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.fieldDeep};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e5484d;
    ${({ $on }) =>
      $on &&
      css`
        animation: ${pulse} 1.4s ease-in-out infinite;
      `}
  }
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
`;

const RoundButton = styled.button<{ $small?: boolean }>`
  flex: none;
  width: ${({ $small }) => ($small ? 44 : 56)}px;
  height: ${({ $small }) => ($small ? 44 : 56)}px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 0;
  background: ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.ink};
  cursor: pointer;
  svg {
    width: ${({ $small }) => ($small ? 20 : 24)}px;
    height: ${({ $small }) => ($small ? 20 : 24)}px;
    fill: currentColor;
  }
  &:disabled {
    background: ${AMBER};
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tealInk};
    outline-offset: 3px;
  }
`;

const NowLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.mint};
`;

const NowTitle = styled.p`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
`;

const NowArtist = styled.p`
  margin-top: 2px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const ListTitle = styled.p`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.inkMuted};
  font: inherit;
  font-size: 13px;
  text-align: left;
  strong {
    display: block;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.ink};
  }
  &[aria-pressed] {
    cursor: pointer;
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

const PodcastCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.line};
`;

const Episode = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Show = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.tealInk};
`;

const EpisodeTitle = styled.p`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
`;

const Meta = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Scrubber = styled.div`
  > span {
    display: block;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.paperDeep};
  }
  i {
    display: block;
    height: 100%;
    background: ${({ theme }) => theme.colors.tealInk};
    transform-origin: left;
    transition: transform 1s linear;
  }
`;

const Times = styled.p`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Transport = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const Skip = styled.button`
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.tealInk};
    outline-offset: 2px;
  }
`;

const Speed = styled(Skip)`
  min-width: 56px;
  border-radius: 999px;
  margin-left: 8px;
`;

const Article = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 330px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 15px;
  line-height: 1.6;
`;

const ArticleTitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
`;

const Listen = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px 8px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onFieldSoft};
  font-size: 13px;
  > div {
    flex: 1;
  }
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.onField};
    line-height: 1.3;
  }
`;

const Sentence = styled.span<{ $active: boolean }>`
  border-radius: 4px;
  transition: background-color 0.3s ${({ theme }) => theme.ease.out};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.mint : 'transparent'};
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
`;

const Bars = styled.span<{ $on: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 28px;
  i {
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.mint};
    transform-origin: bottom;
    transform: scaleY(0.3);
    ${({ $on }) =>
      $on &&
      css`
        animation: ${bounce} 0.9s ease-in-out infinite;
      `}
  }
  i:nth-child(2) {
    animation-delay: -0.3s;
  }
  i:nth-child(3) {
    animation-delay: -0.6s;
  }
  i:nth-child(4) {
    animation-delay: -0.15s;
  }
  i:nth-child(5) {
    animation-delay: -0.45s;
  }
  @media (prefers-reduced-motion: reduce) {
    i {
      animation: none;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
  gap: 6px;
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
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.paper};
    }
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
