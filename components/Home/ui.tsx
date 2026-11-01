import styled, { css } from 'styled-components';
import Markdown, { type MarkdownToJSX } from 'markdown-to-jsx';

// Tagi w treściach: <secondary> to akcent turkusowy, <primary> to podkreślenie miętą.
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

export const cmsOverrides: MarkdownToJSX.Overrides = {
  primary: { component: Highlight },
  secondary: { component: Accent },
};

interface CmsInlineProps {
  children?: string;
  overrides?: MarkdownToJSX.Overrides;
}

export const CmsInline = ({ children, overrides = {} }: CmsInlineProps) => (
  <Markdown
    options={{
      forceInline: true,
      overrides: { ...cmsOverrides, ...overrides },
    }}
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

export const Section = styled.section<{ $tone?: 'deep' }>`
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

// Tytuły na turkusowym polu: oba tagi akcentu renderują się miętą
const Mint = styled.span`
  color: ${({ theme }) => theme.colors.mint};
`;

export const mintOverrides: MarkdownToJSX.Overrides = {
  primary: { component: Mint },
  secondary: { component: Mint },
};

// Pasek wizytówki: turkus przechodzący w miętę
export const bandFill = css`
  linear-gradient(
    118deg,
    ${({ theme }) => theme.colors.teal} 0%,
    #6cc39a 55%,
    ${({ theme }) => theme.colors.mint} 100%
  )
`;

// Cienkie łuki nawiązujące do warstwic na pasku dawnej wizytówki
export const bandContours = (at: string, step: number) => `
  repeating-radial-gradient(
    circle at ${at},
    transparent 0 ${step}px,
    rgba(15, 59, 58, 0.14) ${step}px ${step + 1.5}px
  )
`;

// Lista z turkusowymi kropkami (opinie, opisy doświadczenia)
export const bulletList = css`
  li {
    position: relative;
    padding-left: 16px;
  }
  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.teal};
  }
`;
