import { useContext, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { LangContext } from '../../pages/_app';
import { t } from './copy';
import { CmsInline, Wrap } from './ui';
import { LineIcon } from './icons';
import useInView from './useInView';

export const initials = (name = '') =>
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

const RecCard = ({ item, index, copy }) => {
  const [open, setOpen] = useState(false);
  const [lead, ...rest] = item.paragraphs;
  const fan = FAN[index % FAN.length];
  const company = item.roles[item.roles.length - 1];
  const role = item.roles.length > 1 ? item.roles.slice(0, -1).join(' · ') : '';

  return (
    <Card
      style={{ '--r': `${fan.r}deg`, '--y': `${fan.y}px`, '--i': index }}
      $open={open}
    >
      <Band aria-hidden="true" />
      <Disc aria-hidden="true">{initials(item.author)}</Disc>
      <Who>
        <Name>{item.author}</Name>
        <Role>
          {role && <span>{role}</span>}
          <b>{company}</b>
        </Role>
      </Who>
      <Quote>
        <Lead>{lead}</Lead>
        {open &&
          rest.map((paragraph) => <Para key={paragraph}>{paragraph}</Para>)}
      </Quote>
      <Foot>
        {rest.length > 0 ? (
          <More type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
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

const Recommendations = ({ page, items }) => {
  const [lang] = useContext(LangContext);
  const copy = t(lang);
  const track = useRef(null);
  const [deckRef, inView] = useInView({ threshold: 0.15 });

  const scrollBy = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('article');
    const step = card ? card.getBoundingClientRect().width + 24 : 400;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <Field id="opinie" aria-labelledby="opinie-title">
      <Head>
        <Title id="opinie-title">
          {page ? (
            <CmsInline overrides={{ secondary: { component: Mint }, primary: { component: Mint } }}>
              {page.title}
            </CmsInline>
          ) : (
            copy.recTitle
          )}
        </Title>
        <Aside>
          {page?.content && <Intro>{page.content}</Intro>}
          <Arrows>
            <Arrow type="button" onClick={() => scrollBy(-1)} aria-label={copy.prev} $flip>
              <LineIcon name="arrow" size={20} />
            </Arrow>
            <Arrow type="button" onClick={() => scrollBy(1)} aria-label={copy.next}>
              <LineIcon name="arrow" size={20} />
            </Arrow>
          </Arrows>
        </Aside>
      </Head>

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
          <RecCard key={item.id} item={item} index={index} copy={copy} />
        ))}
      </Track>
    </Field>
  );
};

export default Recommendations;

const Mint = styled.span`
  color: ${({ theme }) => theme.colors.mint};
`;

const Field = styled.section`
  position: relative;
  padding: clamp(24px, 3vw, 40px) 0 clamp(48px, 6vw, 80px);
  background: ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
  overflow: hidden;
`;

const Head = styled(Wrap)`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: end;
  gap: 20px clamp(28px, 5vw, 80px);
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(2rem, 3.2vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-wrap: balance;
`;

const Aside = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
`;

const Intro = styled.p`
  max-width: 40ch;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Arrows = styled.div`
  display: flex;
  gap: 8px;
  flex: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    display: none;
  }
`;

const Arrow = styled.button`
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
    color 0.25s ${({ theme }) => theme.ease.out};
  svg {
    transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
  }
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.ink};
    }
  }
`;

// Tor z kartami wyrównany do lewej krawędzi kontenera, ucieka w prawo poza ekran
const Track = styled.div`
  --gutter: max(
    ${({ theme }) => theme.layout.gutter},
    calc((100vw - ${({ theme }) => theme.layout.maxWidth}) / 2 + ${({ theme }) => theme.layout.gutter})
  );
  margin-top: clamp(28px, 3.5vw, 44px);
  display: flex;
  align-items: flex-start;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  padding: 24px var(--gutter) 40px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &:focus-visible {
    outline-offset: -4px;
  }

  /* talia rozkłada się z kupki, gdy wjedzie w widok */
  article {
    transition:
      transform 0.9s ${({ theme }) => theme.ease.out} calc(var(--i) * 70ms),
      box-shadow 0.4s ${({ theme }) => theme.ease.out};
  }
  ${({ $in }) =>
    !$in &&
    css`
      article {
        transform: translateX(calc(var(--i) * -88%)) rotate(calc(var(--r) * 3))
          translateY(var(--y));
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    article {
      transition: none;
    }
  }
`;

const Card = styled.article`
  position: relative;
  z-index: calc(10 - var(--i));
  flex: 0 0 clamp(300px, 84vw, 460px);
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.ink};
  padding: 0 28px 24px;
  overflow: hidden;
  transform: rotate(var(--r)) translateY(var(--y));
  box-shadow: 0 30px 50px -24px rgba(3, 18, 17, 0.7);

  @media (hover: hover) {
    &:hover {
      transform: rotate(0deg) translateY(-6px);
      box-shadow: 0 40px 60px -24px rgba(3, 18, 17, 0.8);
    }
  }
  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(0deg) translateY(0);
    `}
`;

const Band = styled.div`
  margin: 0 -28px;
  height: 64px;
  background:
    repeating-radial-gradient(
      circle at 92% 160%,
      transparent 0 18px,
      rgba(15, 59, 58, 0.14) 18px 19.5px
    ),
    linear-gradient(118deg, #50a3a2 0%, #6cc39a 55%, #8fe388 100%);
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

const Quote = styled.blockquote`
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
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
