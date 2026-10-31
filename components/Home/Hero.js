import { useContext, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LangContext } from '../../pages/_app';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useCanHover } from '../../hooks/useDevice';
import { CONTACT, cvHref, t } from './copy';
import { plainSkill } from './parse';
import { Glyph, Wrap } from './ui';
import { LineIcon } from './icons';
import { initials } from './Recommendations';

// Rewers karty pokazuje rdzeń stacku; pełna lista jest w sekcji Stack
const BACK_ITEMS = 6;

const FlipIcon = () => <LineIcon name="flip" size={16} />;

// Spoczynkowe ustawienie karty (jak na zaakceptowanym szkicu)
const REST = { rx: 6, ry: -14 };

const Hero = ({ stack, recommendations = [] }) => {
  const [lang] = useContext(LangContext);
  const copy = t(lang);
  const [flipped, setFlipped] = useState(false);
  const canHover = useCanHover();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const tiltRef = useRef(null);
  const frame = useRef(0);

  const interactive = canHover && !reducedMotion;

  const setTilt = (rx, ry, gx = 30, gy = 20) => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--gx', `${gx}%`);
    el.style.setProperty('--gy', `${gy}%`);
  };

  const onPointerMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      tiltRef.current?.setAttribute('data-tracking', '');
      setTilt(-py * 16, px * 22, (px + 0.5) * 100, (py + 0.5) * 100);
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    tiltRef.current?.removeAttribute('data-tracking');
    setTilt(REST.rx, REST.ry);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const current = (stack[0]?.items || []).slice(0, BACK_ITEMS);
  const more = stack[1]?.items || [];

  return (
    <HeroField id="start">
      <HeroWrap>
        <Intro>
          <Hello>
            {copy.helloA} <em>{copy.helloB}</em>
          </Hello>
          <Lede>{copy.lede}</Lede>
          {recommendations.length > 0 && (
            <Proof href="#opinie">
              <Discs aria-hidden="true">
                {recommendations.map(({ id, author }) => (
                  <span key={id}>{initials(author)}</span>
                ))}
              </Discs>
              <ProofText>
                <b>{recommendations.length}</b> {copy.recCount}
              </ProofText>
              <LineIcon name="arrow" size={18} />
            </Proof>
          )}
          <FlipHint
            type="button"
            onClick={() => setFlipped(!flipped)}
            aria-controls="business-card"
          >
            <HintIcon $flipped={flipped} aria-hidden="true">
              <FlipIcon />
            </HintIcon>
            {flipped ? copy.flipToFront : copy.flipHint}
          </FlipHint>
        </Intro>

        <Stage onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          <FloorShadow aria-hidden="true" />
          <Tilt ref={tiltRef} $interactive={interactive} $flipped={flipped}>
            <Flipper id="business-card" $flipped={flipped}>
              <Front inert={flipped} aria-hidden={flipped}>
                <Band aria-hidden="true">
                  <BandLines />
                </Band>
                <Avatar src="/images/avatar-kriss.png" alt="" width="132" height="132" />
                <Socials>
                  <SocialLink href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Glyph name="github" size="20px" />
                  </SocialLink>
                  <SocialLink href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Glyph name="linkedin" size="20px" />
                  </SocialLink>
                </Socials>
                <Who>
                  <CardName>Krzysztof Gryc</CardName>
                  <CardRole>{copy.role}</CardRole>
                </Who>
                <Rows>
                  <RowPrimary href={cvHref(lang)} target="_blank" rel="noopener noreferrer">
                    {copy.downloadCv}
                    <Glyph name="download" size="16px" />
                  </RowPrimary>
                  <Row href={CONTACT.phoneHref}>
                    <Glyph name="phone" size="16px" />
                    {CONTACT.phone}
                  </Row>
                  <Row href={`mailto:${CONTACT.email}`} $wide>
                    <Glyph name="email" size="18px" />
                    {CONTACT.email}
                  </Row>
                </Rows>
                <FlipCorner type="button" onClick={() => setFlipped(true)} aria-label={copy.flipToBack}>
                  Stack
                  <FlipIcon />
                </FlipCorner>
                <Glare aria-hidden="true" />
              </Front>

              <Back inert={!flipped} aria-hidden={!flipped}>
                <BackTitle>{copy.cardBackTitle}</BackTitle>
                <StackList>
                  {current.map((item) => (
                    <li key={item}>{plainSkill(item)}</li>
                  ))}
                </StackList>
                {more.length > 0 && (
                  <div>
                    <BackSub>{copy.cardBackMore}</BackSub>
                    <MoreList>
                      {more.map((item) => plainSkill(item)).join(' · ')}
                    </MoreList>
                  </div>
                )}
                <FlipCorner type="button" onClick={() => setFlipped(false)} aria-label={copy.flipToFront} $onBack>
                  {copy.flipToFront}
                  <FlipIcon />
                </FlipCorner>
                <Glare aria-hidden="true" />
              </Back>
            </Flipper>
          </Tilt>
        </Stage>
      </HeroWrap>
    </HeroField>
  );
};

export default Hero;

const HeroField = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-top: calc(${({ theme }) => theme.layout.navHeight} + clamp(16px, 4vh, 48px));
  padding-bottom: 0;
  ${({ theme: { colors } }) => css`
    background:
      radial-gradient(
        60% 70% at 74% 56%,
        rgba(143, 227, 136, 0.16),
        transparent 70%
      ),
      ${colors.field};
    color: ${colors.onField};
  `}
`;

const HeroWrap = styled(Wrap)`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 80px);

  @media (max-width: ${({ theme }) => theme.breakpoints.laptopS}) {
    grid-template-columns: 1fr;
    padding-top: 32px;
  }
`;

const Intro = styled.div`
  max-width: 640px;
`;

const Hello = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(3.25rem, 6.4vw, 7.75rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-wrap: balance;
  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.mint};
  }
`;

const Lede = styled.p`
  margin-top: 28px;
  max-width: 34ch;
  font-size: clamp(1.1rem, 1.3vw, 1.45rem);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Proof = styled.a`
  margin-top: 32px;
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 14px;
  padding: 8px 18px 8px 8px;
  border-radius: 99px;
  background: rgba(143, 227, 136, 0.1);
  border: 1px solid rgba(143, 227, 136, 0.3);
  color: ${({ theme }) => theme.colors.onField};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out};
  svg {
    color: ${({ theme }) => theme.colors.mint};
    transition: transform 0.35s ${({ theme }) => theme.ease.out};
  }
  @media (hover: hover) {
    &:hover {
      background: rgba(143, 227, 136, 0.18);
      border-color: ${({ theme }) => theme.colors.mint};
    }
    &:hover svg {
      transform: translateX(4px);
    }
  }
`;

const Discs = styled.span`
  display: flex;
  span {
    width: 36px;
    height: 36px;
    margin-left: -6px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.field};
    background: ${({ theme }) => theme.colors.paper};
    color: ${({ theme }) => theme.colors.field};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 800;
    font-size: 13px;
    letter-spacing: -0.02em;
  }
  span:first-child {
    margin-left: 0;
    background: ${({ theme }) => theme.colors.mint};
  }
`;

const ProofText = styled.span`
  font-size: 15px;
  line-height: 1.3;
  font-weight: 500;
  b {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 800;
    font-size: 1.15em;
    color: ${({ theme }) => theme.colors.mint};
  }
`;

const FlipHint = styled.button`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.mint};
  @media (hover: hover) {
    &:hover span {
      background: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.field};
    }
  }
`;

const HintIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.mint};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out},
    transform 0.8s ${({ theme }) => theme.ease.out};
  transform: rotate(${({ $flipped }) => ($flipped ? '-360deg' : '0deg')});
  svg {
    width: 20px;
    height: 20px;
  }
`;

const dropIn = keyframes`
  from {
    transform: translateY(64px) rotateX(28deg) scale(0.94);
    filter: blur(10px);
    opacity: 0;
  }
  to {
    transform: none;
    filter: none;
    opacity: 1;
  }
`;

const Stage = styled.div`
  position: relative;
  perspective: 1600px;
  padding: clamp(8px, 2vw, 24px) 0 56px;
  animation: ${dropIn} 1.2s ${({ theme }) => theme.ease.out} 0.1s both;
  touch-action: pan-y;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FloorShadow = styled.div`
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 18px;
  height: 56px;
  border-radius: 50%;
  background: rgba(3, 18, 17, 0.55);
  filter: blur(28px);
`;

const Tilt = styled.div`
  --rx: ${REST.rx}deg;
  --ry: ${REST.ry}deg;
  --gx: 30%;
  --gy: 20%;
  position: relative;
  max-width: 660px;
  margin-inline: auto;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.9s ${({ theme }) => theme.ease.out};
  &[data-tracking] {
    transition: transform 0.12s linear;
  }

  ${({ $interactive }) =>
    !$interactive &&
    css`
      --rx: 3deg;
      --ry: -6deg;
    `}

  /* płyta rewersu wystaje zza karty, zanim ktoś ją odwróci */
  &::before {
    content: '';
    position: absolute;
    inset: 4% -3.5% 4% 6%;
    border-radius: ${({ theme }) => theme.radii.card};
    background: linear-gradient(160deg, #23706f, ${({ theme }) => theme.colors.fieldDeep});
    border: 1px solid rgba(143, 227, 136, 0.28);
    transform: translateZ(-36px);
    opacity: ${({ $flipped }) => ($flipped ? 0 : 1)};
    transition: opacity 0.4s ${({ theme }) => theme.ease.out};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Flipper = styled.div`
  display: grid;
  transform-style: preserve-3d;
  transition: transform 0.9s ${({ theme }) => theme.ease.out};
  transform: rotateY(${({ $flipped }) => ($flipped ? '180deg' : '0deg')});

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const face = css`
  grid-area: 1 / 1;
  position: relative;
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7) inset,
    0 30px 60px -20px rgba(3, 18, 17, 0.6);
`;

const Front = styled.article`
  ${face};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.ink};
  padding: 0 clamp(22px, 4vw, 44px) clamp(22px, 4vw, 40px);
`;

const Back = styled.article`
  ${face};
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(26px, 4vw, 44px);
  ${({ theme: { colors } }) => css`
    background:
      radial-gradient(
        120% 80% at 100% 0%,
        rgba(143, 227, 136, 0.22),
        transparent 60%
      ),
      ${colors.fieldDeep};
    color: ${colors.onField};
    border: 1px solid rgba(143, 227, 136, 0.25);
  `}
`;

const Glare = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--gx) var(--gy),
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0) 45%
  );
  mix-blend-mode: soft-light;
  opacity: 0;
  transition: opacity 0.4s ${({ theme }) => theme.ease.out};
  [data-tracking] & {
    opacity: 1;
  }
`;

const Band = styled.div`
  position: relative;
  margin: 0 calc(-1 * clamp(22px, 4vw, 44px));
  height: clamp(110px, 14vw, 150px);
  background: linear-gradient(118deg, #50a3a2 0%, #6cc39a 55%, #8fe388 100%);
  overflow: hidden;
`;

// Cienkie łuki nawiązują do warstwic na pasku dawnej wizytówki
const BandLines = styled.span`
  position: absolute;
  inset: 0;
  background: repeating-radial-gradient(
    circle at 92% 140%,
    transparent 0 22px,
    rgba(15, 59, 58, 0.14) 22px 23.5px
  );
`;

const Avatar = styled.img`
  position: relative;
  width: clamp(96px, 11vw, 132px);
  height: auto;
  aspect-ratio: 1;
  margin-top: calc(-1 * clamp(56px, 6.5vw, 76px));
  border-radius: 50%;
  border: 6px solid ${({ theme }) => theme.colors.paper};
  background: #fff;
`;

const Socials = styled.div`
  position: absolute;
  right: clamp(22px, 4vw, 44px);
  top: calc(clamp(110px, 14vw, 150px) + 18px);
  display: flex;
  gap: 8px;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.paperDeep};
  color: ${({ theme }) => theme.colors.field};
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.field};
      color: ${({ theme }) => theme.colors.mint};
    }
  }
`;

const Who = styled.div`
  margin-top: 18px;
`;

const CardName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(1.9rem, 3.4vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.035em;
`;

const CardRole = styled.p`
  margin-top: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.tealInk};
`;

const Rows = styled.div`
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const rowBase = css`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 0 18px;
  border-radius: ${({ theme }) => theme.radii.control};
  font-weight: 600;
  font-size: 15px;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
`;

const RowPrimary = styled.a`
  ${rowBase};
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.ink};
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.field};
      color: ${({ theme }) => theme.colors.mint};
    }
  }
`;

const Row = styled.a`
  ${rowBase};
  border: 1.5px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.ink};
  font-variant-numeric: tabular-nums;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  svg {
    color: ${({ theme }) => theme.colors.tealInk};
  }
  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.field};
    }
  }
`;

const FlipCorner = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  ${({ $onBack, theme: { colors } }) =>
    $onBack
      ? css`
          position: static;
          align-self: flex-start;
          border: 1.5px solid ${colors.mint};
          color: ${colors.mint};
          @media (hover: hover) {
            &:hover {
              background: ${colors.mint};
              color: ${colors.ink};
            }
          }
        `
      : css`
          background: rgba(15, 59, 58, 0.82);
          color: ${colors.onField};
          @media (hover: hover) {
            &:hover {
              background: ${colors.ink};
              color: ${colors.mint};
            }
          }
        `}
`;

const BackTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.mint};
`;

const StackList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  li {
    padding: 7px 0;
    border-bottom: 1px solid rgba(198, 218, 213, 0.18);
    font-size: 14px;
    line-height: 1.35;
    font-weight: 500;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

const BackSub = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mint};
`;

const MoreList = styled.p`
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;
