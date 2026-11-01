import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { LangContext } from '../../pages/_app';
import { SECTIONS, t } from './copy';

// Pasek nad turkusowym hero jest przezroczysty; gdy hero zniknie spod
// paska, przechodzi w jasny papier. Aktywną sekcję śledzi IntersectionObserver.
const Nav = () => {
  const [lang, setLang] = useContext(LangContext);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const copy = t(lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hero = document.getElementById('start');
    if (!hero) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: '-76px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // hero nie ma pozycji w menu: powrót na górę czyści podkreślenie
          setActive(entry.target.id === 'start' ? null : entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    [{ id: 'start' }, ...SECTIONS].forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const dark = solid || open;

  return (
    <Bar $solid={dark} $scrolled={scrolled}>
      <SkipLink href="#opinie">{copy.skip}</SkipLink>
      <Inner>
        <Mark href="#start" onClick={() => setOpen(false)}>
          krzysztof<b>g</b>.pl
        </Mark>
        <Links id="site-menu" $open={open}>
          {SECTIONS.map(({ id, pl, en }) => (
            <li key={id}>
              <NavLink
                href={`#${id}`}
                aria-current={active === id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {lang === 'pl' ? pl : en}
              </NavLink>
            </li>
          ))}
        </Links>
        <Actions>
          <LangButton
            type="button"
            onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
            aria-label={copy.switchLang}
            lang={lang === 'pl' ? 'en' : 'pl'}
          >
            {lang === 'pl' ? 'EN' : 'PL'}
          </LangButton>
          <MenuButton
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? copy.close : copy.menu}
          </MenuButton>
        </Actions>
      </Inner>
    </Bar>
  );
};

export default Nav;

const Bar = styled.header<{ $solid: boolean; $scrolled: boolean }>`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  transition:
    background-color 0.35s ${({ theme }) => theme.ease.out},
    color 0.35s ${({ theme }) => theme.ease.out},
    box-shadow 0.35s ${({ theme }) => theme.ease.out};
  ${({ $solid, $scrolled, theme: { colors } }) =>
    $solid
      ? css`
          background: ${colors.paper};
          color: ${colors.ink};
          box-shadow: 0 1px 0 ${colors.line};
          --nav-accent: ${colors.tealInk};
          --nav-pill: ${colors.field};
          --nav-pill-ink: ${colors.onField};
        `
      : css`
          background: ${$scrolled ? colors.field : 'transparent'};
          box-shadow: ${$scrolled ? '0 1px 0 rgba(198, 218, 213, 0.14)' : 'none'};
          color: ${colors.onField};
          --nav-accent: ${colors.mint};
          --nav-pill: ${colors.mint};
          --nav-pill-ink: ${colors.ink};
        `}
`;

const SkipLink = styled.a`
  position: absolute;
  left: 16px;
  top: -100px;
  padding: 10px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.mint};
  color: ${({ theme }) => theme.colors.ink};
  font-weight: 600;
  &:focus-visible {
    top: 12px;
  }
`;

const Inner = styled.nav`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: ${({ theme }) => theme.layout.navHeight};
  margin: 0 auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Mark = styled.a`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
  b {
    color: var(--nav-accent);
  }
`;

const Links = styled.ul<{ $open: boolean }>`
  display: flex;
  gap: clamp(16px, 2.6vw, 36px);
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletL}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: ${({ theme }) => theme.layout.navHeight};
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 8px ${({ theme }) => theme.layout.gutter} 24px;
    background: ${({ theme }) => theme.colors.paper};
    box-shadow: 0 24px 32px -24px rgba(15, 59, 58, 0.35);
    li + li {
      border-top: 1px solid ${({ theme }) => theme.colors.line};
    }
  }
`;

const NavLink = styled.a`
  position: relative;
  display: block;
  font-size: 15px;
  font-weight: 500;
  padding: 6px 0;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    border-radius: 2px;
    background: var(--nav-accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ${({ theme }) => theme.ease.out};
  }
  &[aria-current]::after {
    transform: scaleX(1);
  }
  @media (hover: hover) {
    &:hover::after {
      transform: scaleX(1);
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletL}) {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    padding: 14px 0;
    &::after {
      display: none;
    }
    &[aria-current] {
      color: ${({ theme }) => theme.colors.tealInk};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const pill = css`
  min-height: 40px;
  padding: 0 16px;
  border-radius: 99px;
  border: 1.5px solid var(--nav-pill);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
`;

const LangButton = styled.button`
  ${pill};
  color: var(--nav-pill);
  @media (hover: hover) {
    &:hover {
      background: var(--nav-pill);
      color: var(--nav-pill-ink);
    }
  }
`;

const MenuButton = styled.button`
  ${pill};
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletL}) {
    display: inline-flex;
    align-items: center;
  }
`;
