import { useContext } from 'react';
import styled from 'styled-components';
import { LangContext } from '../../pages/_app';
import { CONTACT, cvHref, t } from './copy';
import { CmsInline, Glyph, MintButton, Wrap } from './ui';

const Mint = styled.span`
  color: ${({ theme }) => theme.colors.mint};
`;

const Contact = ({ page }) => {
  const [lang] = useContext(LangContext);
  const copy = t(lang);

  return (
    <Field id="kontakt" aria-labelledby="kontakt-title">
      <Wrap>
        <Title id="kontakt-title">
          {page ? (
            <CmsInline overrides={{ secondary: { component: Mint }, primary: { component: Mint } }}>
              {page.title}
            </CmsInline>
          ) : lang === 'pl' ? (
            'Kontakt'
          ) : (
            'Contact'
          )}
        </Title>
        <Lead>{copy.contactLead}</Lead>

        <Email href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Email>

        <Channels>
          <Channel href={CONTACT.phoneHref}>
            <Glyph name="phone" size="18px" />
            {CONTACT.phone}
          </Channel>
          <Channel href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
            <Glyph name="linkedin" size="18px" />
            LinkedIn
          </Channel>
          <Channel href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            <Glyph name="github" size="18px" />
            GitHub
          </Channel>
          <MintButton href={cvHref(lang)} target="_blank" rel="noopener noreferrer">
            {copy.downloadCv}
            <Glyph name="download" size="16px" />
          </MintButton>
        </Channels>

        <Footer>
          <span>© {new Date().getFullYear()} Krzysztof Gryc · Tychy</span>
          <span>{copy.footer}</span>
        </Footer>
      </Wrap>
    </Field>
  );
};

export default Contact;

const Field = styled.section`
  padding-top: clamp(72px, 8vw, 112px);
  padding-bottom: 40px;
  background:
    radial-gradient(
      50% 60% at 85% 10%,
      rgba(143, 227, 136, 0.14),
      transparent 70%
    ),
    ${({ theme }) => theme.colors.field};
  color: ${({ theme }) => theme.colors.onField};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 800;
  font-size: clamp(2.5rem, 5.4vw, 6.25rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-wrap: balance;
  max-width: 14ch;
`;

const Lead = styled.p`
  margin-top: 24px;
  max-width: 44ch;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;

const Email = styled.a`
  display: inline-block;
  margin-top: clamp(40px, 6vw, 72px);
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: clamp(1.9rem, 5.6vw, 6.5rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.mint};
  overflow-wrap: anywhere;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0% 3px no-repeat;
  padding-bottom: 6px;
  transition: background-size 0.6s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover {
      background-size: 100% 3px;
    }
  }
`;

const Channels = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const Channel = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 0 22px;
  border-radius: ${({ theme }) => theme.radii.control};
  border: 1.5px solid rgba(198, 218, 213, 0.35);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition:
    border-color 0.25s ${({ theme }) => theme.ease.out},
    color 0.25s ${({ theme }) => theme.ease.out};
  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.mint};
      color: ${({ theme }) => theme.colors.mint};
    }
  }
`;

const Footer = styled.footer`
  margin-top: clamp(56px, 7vw, 96px);
  padding-top: 24px;
  border-top: 1px solid rgba(198, 218, 213, 0.22);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onFieldSoft};
`;
