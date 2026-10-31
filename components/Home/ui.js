import styled, { css } from 'styled-components';
import Markdown from '../Markdown/Markdown';
import { LineIcon } from './icons';

// Tagi z CMS: <secondary> to akcent turkusowy, <primary> to podkreślenie miętą.
const Accent = styled.span`
  color: ${({ theme }) => theme.colors.tealInk};
`;

const Highlight = styled.span`
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.mint};
  text-decoration-thickness: max(3px, 0.1em);
  text-underline-offset: 0.3em;
  text-decoration-skip-ink: none;
`;

export const cmsOverrides = {
  primary: { component: Highlight },
  secondary: { component: Accent },
};

export const CmsInline = ({ children, overrides = {} }) => (
  <Markdown
    options={{ forceInline: true, overrides: { ...cmsOverrides, ...overrides } }}
  >
    {(children || '').replace(/^#+\s*/, '')}
  </Markdown>
);

export const CmsBlock = ({ children, overrides = {} }) => (
  <Markdown
    options={{ forceBlock: true, overrides: { ...cmsOverrides, ...overrides } }}
  >
    {children || ''}
  </Markdown>
);

export const Wrap = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;

export const Section = styled.section`
  padding-block: clamp(64px, 8vw, 112px);
  ${({ $tone, theme: { colors } }) =>
    $tone === 'deep' &&
    css`
      background: ${colors.paperDeep};
    `}
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(2.5rem, 5.4vw, 6.25rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-wrap: balance;
  color: ${({ theme }) => theme.colors.field};
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  padding: 0 24px;
  border-radius: ${({ theme }) => theme.radii.control};
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  transition:
    background-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out},
    border-color 0.25s ${({ theme }) => theme.ease.out},
    transform 0.25s ${({ theme }) => theme.ease.out};
  &:active {
    transform: translateY(1px) scale(0.99);
  }
`;

export const MintButton = styled.a`
  ${buttonBase};
  ${({ theme: { colors } }) => css`
    background: ${colors.mint};
    color: ${colors.ink};
    @media (hover: hover) {
      &:hover {
        background: ${colors.onField};
      }
    }
  `}
`;

export const Glyph = ({ name, size = '18px' }) => (
  <LineIcon name={name} size={parseInt(size, 10)} />
);

export const EmptyNote = styled.p`
  margin-top: 24px;
  max-width: 60ch;
  color: ${({ theme }) => theme.colors.inkMuted};
`;
