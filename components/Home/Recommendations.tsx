'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styled, { css } from 'styled-components';
import type {
  Recommendation,
  RecommendationsSection,
} from '../../content/types';
import { useLang } from './lang';
import type { Copy } from './copy';
import {
  CmsInline,
  Wrap,
  bandContours,
  bandFill,
  bulletList,
  mintOverrides,
} from './ui';
import { LineIcon } from './icons';
import useInView from './useInView';
import RecReel from './RecReel';

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export const initials = (name = ''): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

// Lekko rozrzucona talia: każda karta ma własny kąt i uskok
const FAN = [
  { r: -2.2, y: 10 },
  { r: 1.4, y: 0 },
  { r: -0.8, y: 16 },
  { r: 2, y: 4 },
  { r: -1.6, y: 12 },
];

interface RecCardProps {
  item: Recommendation;
  index: number;
  offset: number;
  active: boolean;
  near: boolean;
  onPick: () => void;
  playing: boolean;
  onTogglePlay: (play: boolean) => void;
  onEnded: () => void;
  copy: Copy;
}

const RecCard = ({
  item,
  index,
  offset,
  active,
  near,
  onPick,
  playing,
  onTogglePlay,
  onEnded,
  copy,
}: RecCardProps) => {
  const [open, setOpen] = useState(false);
  const [lead, ...rest] = item.text;
  const fan = FAN[index % FAN.length];

  return (
    <Card
      style={{
        '--r': `${fan.r}deg`,
        '--y': `${fan.y}px`,
        '--o': offset,
        '--z': 10 - Math.abs(offset),
      }}
      $active={active}
      $near={near}
      onClick={active ? undefined : onPick}
    >
      <Band aria-hidden="true" />
      <Disc aria-hidden="true">{initials(item.author)}</Disc>
      <Who>
        <Name>{item.author}</Name>
        <Role>
          {item.position && <span>{item.position}</span>}
          <b>{item.company}</b>
        </Role>
      </Who>
      {item.reel && !open && (
        <RecReel
          key={active ? 'active' : 'idle'}
          item={item}
          reel={item.reel}
          active={active}
          playing={playing && !open}
          onTogglePlay={onTogglePlay}
          onEnded={onEnded}
          copy={copy}
        />
      )}
      {/* przy rolce pełny tekst zostaje w DOM dla czytników, widać go po rozwinięciu */}
      <Quote $hidden={Boolean(item.reel) && !open}>
        {typeof lead === 'string' && <Lead>{lead}</Lead>}
        {(open || item.reel) &&
          rest.map((block, i) =>
            typeof block === 'string' ? (
              <Para key={i}>{block}</Para>
            ) : (
              <List key={i}>
                {block.list.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </List>
            ),
          )}
      </Quote>
      <Foot>
        {rest.length > 0 || item.reel ? (
          <More
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? copy.readLess : copy.readMore}
          </More>
        ) : (
          <span />
        )}
        {item.date && <DateLabel>{item.date}</DateLabel>}
      </Foot>
    </Card>
  );
};

// Wersja do szybkiego czytania: wszystkie karty naraz, bez rolek i ruchu
const TextCard = ({ item, copy }: { item: Recommendation; copy: Copy }) => {
  const [open, setOpen] = useState(false);
  const [lead, ...rest] = item.text;

  return (
    <Plain>
      <Band aria-hidden="true" />
      <Disc aria-hidden="true">{initials(item.author)}</Disc>
      <Who>
        <Name>{item.author}</Name>
        <Role>
          {item.position && <span>{item.position}</span>}
          <b>{item.company}</b>
        </Role>
      </Who>
      <Quote $hidden={false}>
        {typeof lead === 'string' && <Lead>{lead}</Lead>}
        {open &&
          rest.map((block, i) =>
            typeof block === 'string' ? (
              <Para key={i}>{block}</Para>
            ) : (
              <List key={i}>
                {block.list.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </List>
            ),
          )}
      </Quote>
      <Foot>
        {rest.length > 0 ? (
          <More
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? copy.readLess : copy.readMore}
          </More>
        ) : (
          <span />
        )}
        {item.date && <DateLabel>{item.date}</DateLabel>}
      </Foot>
    </Plain>
  );
};

const Deck = ({ items, copy }: { items: Recommendation[]; copy: Copy }) => {
  const track = useRef<HTMLDivElement | null>(null);
  const [deckRef, inView] = useInView<HTMLDivElement>({ threshold: 0.15 });
  // Start od środka talii, żeby karty wystawały symetrycznie z obu stron
  const start = Math.floor((items.length - 1) / 2);
  const [active, setActive] = useState(start);
  // Rolka gra sama, dopóki talia jest w widoku; pauza użytkownika obowiązuje
  // dla całej talii, a przy ograniczonym ruchu nic nie startuje samo
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  // null: użytkownik jeszcze nie wybrał, decyduje ustawienie ruchu
  const [paused, setPaused] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    let onScreen = false;
    const sync = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const cardAt = (index: number) =>
    track.current?.querySelectorAll('article')[index];

  const centerOn = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = track.current;
    const card = cardAt(index);
    if (!el || !card) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: reduced ? 'auto' : behavior,
    });
  };

  useEffect(() => {
    centerOn(start, 'auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Aktywna jest karta, której środek leży najbliżej środka toru
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        el.querySelectorAll('article').forEach((card, index) => {
          const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = index;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <Track
        ref={(el) => {
          track.current = el;
          deckRef.current = el;
        }}
        $in={inView}
        tabIndex={0}
        aria-label={copy.recPicker}
      >
        {items.map((item, index) => (
          <RecCard
            key={item.id}
            item={item}
            index={index}
            offset={index - start}
            active={index === active}
            near={Math.abs(index - active) === 1}
            onPick={() => centerOn(index)}
            playing={visible && !(paused ?? reduced)}
            onTogglePlay={(play) => setPaused(!play)}
            onEnded={() => {
              if (index < items.length - 1) centerOn(index + 1);
            }}
            copy={copy}
          />
        ))}
      </Track>

      <Controls>
        <Arrow
          type="button"
          onClick={() => centerOn(active - 1)}
          disabled={active === 0}
          aria-label={copy.prev}
          $flip
        >
          <LineIcon name="arrow" size={20} />
        </Arrow>
        <Picks>
          {items.map((item, index) => (
            <Pick
              key={item.id}
              type="button"
              onClick={() => centerOn(index)}
              aria-label={item.author}
              aria-current={index === active ? 'true' : undefined}
            >
              {initials(item.author)}
            </Pick>
          ))}
        </Picks>
        <Arrow
          type="button"
          onClick={() => centerOn(active + 1)}
          disabled={active === items.length - 1}
          aria-label={copy.next}
        >
          <LineIcon name="arrow" size={20} />
        </Arrow>
      </Controls>
    </>
  );
};

type Mode = 'reel' | 'text';
const MODE_KEY = 'rec-mode';

// Wybór trybu zapisany w localStorage; bez niego (tryb prywatny) trzymany w pamięci
let memoryMode: Mode | null = null;
const modeListeners = new Set<() => void>();
const subscribeMode = (onChange: () => void) => {
  modeListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    modeListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};
const readMode = (): Mode | null => {
  try {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === 'reel' || saved === 'text') return saved;
  } catch {
    // brak dostępu do localStorage
  }
  return memoryMode;
};
const saveMode = (next: Mode) => {
  memoryMode = next;
  try {
    window.localStorage.setItem(MODE_KEY, next);
  } catch {
    // brak dostępu do localStorage, zostaje wybór w pamięci
  }
  modeListeners.forEach((notify) => notify());
};

const Recommendations = ({ section }: { section: RecommendationsSection }) => {
  const { items } = section;
  const { copy } = useLang();
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  // null: brak zapisanego wyboru, przy ograniczonym ruchu od razu tekst
  const chosen = useSyncExternalStore(subscribeMode, readMode, () => null);
  const mode: Mode = chosen ?? (reduced ? 'text' : 'reel');

  if (items.length === 0) return null;

  return (
    <Field id="opinie" aria-labelledby="opinie-title">
      <Head>
        <Title id="opinie-title">
          <CmsInline overrides={mintOverrides}>{section.title}</CmsInline>
        </Title>
        {section.intro && <Intro>{section.intro}</Intro>}
        <Switch role="group" aria-label={copy.recMode}>
          <SwitchOption
            type="button"
            aria-pressed={mode === 'reel'}
            onClick={() => saveMode('reel')}
          >
            {copy.recModeReel}
          </SwitchOption>
          <SwitchOption
            type="button"
            aria-pressed={mode === 'text'}
            onClick={() => saveMode('text')}
          >
            {copy.recModeText}
          </SwitchOption>
        </Switch>
      </Head>

      {mode === 'reel' ? (
        <Deck items={items} copy={copy} />
      ) : (
        <TextGrid>
          {items.map((item) => (
            <TextCard key={item.id} item={item} copy={copy} />
          ))}
        </TextGrid>
      )}
    </Field>
  );
};

export default Recommendations;

// Opinie stoją za doświadczeniem, więc mają własne turkusowe pole
const Field = styled.section`
  position: relative;
  padding-block: clamp(64px, 8vw, 112px);
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  overflow: hidden;
`;

const Head = styled(Wrap)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
`;

const Title = styled.h2`
  max-width: 36ch;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(2rem, 3.2vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-wrap: balance;

  // Akcent w osobnej linii, reszta tytułu w drugiej
  > span {
    display: block;
  }
`;

const Intro = styled.p`
  max-width: 52ch;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
  text-wrap: balance;
`;

const Switch = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  border: 1.5px solid rgba(243, 246, 241, 0.28);
`;

const SwitchOption = styled.button`
  min-height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover:not([aria-pressed='true']) {
      color: ${({ theme }) => theme.colors.mint};
    }
  }
  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.mint};
    color: ${({ theme }) => theme.colors.ink};
  }
`;

// Kolumny zamiast siatki: karty mają różną wysokość i rosną po rozwinięciu
const TextGrid = styled(Wrap)`
  margin-top: clamp(28px, 3.5vw, 44px);
  columns: 3 300px;
  column-gap: clamp(20px, 2.4vw, 36px);
`;

const Plain = styled.article`
  break-inside: avoid;
  margin-bottom: clamp(20px, 2.4vw, 36px);
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.ink};
  padding: 0 28px 24px;
  overflow: hidden;
  box-shadow: 0 30px 50px -24px rgba(3, 18, 17, 0.7);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 2vw, 24px);
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;

const Picks = styled.div`
  display: flex;
  gap: 8px;
`;

const Pick = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(243, 246, 241, 0.28);
  color: ${({ theme }) => theme.colors.onFieldSoft};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 13px;
  letter-spacing: -0.02em;
  transition:
    background-color 0.3s ${({ theme }) => theme.ease.out},
    border-color 0.3s ${({ theme }) => theme.ease.out},
    color 0.3s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.mint};
    }
  }
  &[aria-current='true'] {
    background: ${({ theme }) => theme.colors.mint};
    border-color: ${({ theme }) => theme.colors.mint};
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Arrow = styled.button<{ $flip?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.mint};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out},
    opacity 0.25s ${({ theme }) => theme.ease.out};
  svg {
    transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.ink};
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    display: none;
  }
`;

// Tor na pełną szerokość ekranu: aktywna karta stoi na środku,
// sąsiednie wystają symetrycznie zza obu krawędzi
const Track = styled.div<{ $in: boolean }>`
  --gap: clamp(20px, 2.4vw, 36px);
  --card: clamp(280px, 78vw, 500px);
  /* od laptopa trzy środkowe karty mieszczą się w kontenerze */
  @media (min-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    --card: min(
      500px,
      (
          min(100vw, ${({ theme }) => theme.layout.maxWidth}) - 2 *
            ${({ theme }) => theme.layout.gutter} - 2 * var(--gap)
        ) /
        3
    );
  }
  position: relative;
  margin-top: clamp(28px, 3.5vw, 44px);
  display: flex;
  align-items: flex-start;
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 24px calc(50% - var(--card) / 2) 48px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &:focus-visible {
    outline-offset: -4px;
  }

  /* talia rozkłada się z kupki na środku, gdy wjedzie w widok */
  article {
    transition:
      transform 0.9s ${({ theme }) => theme.ease.out}
        calc(var(--z) * -40ms + 400ms),
      opacity 0.5s ${({ theme }) => theme.ease.out},
      box-shadow 0.4s ${({ theme }) => theme.ease.out};
  }
  ${({ $in }) =>
    !$in &&
    css`
      /* && przebija specyficzność stanów $near/$active karty */
      && article {
        transform: translateX(calc(var(--o) * -100%)) rotate(calc(var(--r) * 3))
          translateY(var(--y));
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    article {
      transition: none;
    }
  }
`;

const Card = styled.article<{ $active: boolean; $near: boolean }>`
  position: relative;
  z-index: var(--z);
  flex: 0 0 var(--card);
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.ink};
  padding: 0 28px 24px;
  overflow: hidden;
  transform: rotate(var(--r)) translateY(var(--y)) scale(0.94);
  opacity: 0.4;
  cursor: pointer;
  box-shadow: 0 30px 50px -24px rgba(3, 18, 17, 0.7);

  @media (hover: hover) {
    &:hover {
      opacity: 0.75;
    }
  }
  ${({ $near }) =>
    $near &&
    css`
      && {
        transform: rotate(var(--r)) translateY(var(--y)) scale(0.97);
        opacity: 1;
      }
    `}
  ${({ $active }) =>
    $active &&
    css`
      && {
        transform: rotate(0deg) translateY(0) scale(1);
        opacity: 1;
        cursor: auto;
        box-shadow: 0 44px 70px -28px rgba(3, 18, 17, 0.85);
      }
    `}
`;

const Band = styled.div`
  margin: 0 -28px;
  height: 64px;
  background: ${bandContours('92% 160%', 18)}, ${bandFill};
`;

const Disc = styled.div`
  margin-top: -32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.paper};
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.mint};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.02em;
`;

const Who = styled.div`
  margin-top: 12px;
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
`;

const Role = styled.p`
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.inkMuted};
  span {
    display: block;
  }
  b {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.tealInk};
  }
`;

const Quote = styled.blockquote<{ $hidden: boolean }>`
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  ${({ $hidden }) =>
    $hidden &&
    css`
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    `}
`;

const Lead = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 600;
  font-size: 1.12rem;
  line-height: 1.38;
  letter-spacing: -0.01em;
`;

const Para = styled.p`
  margin-top: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const List = styled.ul`
  margin-top: 12px;
  display: grid;
  gap: 6px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.inkSoft};
  ${bulletList}
`;

const Foot = styled.div`
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

const DateLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.inkMuted};
  font-variant-numeric: tabular-nums;
`;
