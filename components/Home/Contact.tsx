'use client';

import { useSyncExternalStore } from 'react';
import styled from 'styled-components';
import type { ContactSection } from '../../content/types';
import { useLang } from './lang';
import { CONTACT, cvHref } from './copy';
import { CmsInline, MintButton, Wrap, mintOverrides } from './ui';
import { LineIcon } from './icons';
import FloatingSquares from './FloatingSquares';

const noSubscribe = () => () => {};

interface ContactProps {
  section: ContactSection;
  buildYear: number;
}

const Contact = ({ section, buildYear }: ContactProps) => {
  const { lang, copy } = useLang();
  // HTML niesie rok z builda; React hydratuje z nim, a potem bierze bieżący,
  // więc stara statyczna strona nie zgłasza błędu hydracji
  const year = useSyncExternalStore(
    noSubscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );

  return (
    <Field id="kontakt" aria-labelledby="kontakt-title">
      <FloatingSquares count={7} />
      <Wrap>
        <Title id="kontakt-title">
          <CmsInline overrides={mintOverrides}>{section.title}</CmsInline>
        </Title>
        <Lead>{copy.contactLead}</Lead>

        <Email href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Email>

        <Channels>
          <Channel href={CONTACT.phoneHref}>
            <LineIcon name="phone" size={18} />
            {CONTACT.phone}
          </Channel>
          <Channel
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LineIcon name="linkedin" size={18} />
            LinkedIn
          </Channel>
          <Channel
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LineIcon name="github" size={18} />
            GitHub
          </Channel>
          <MintButton
            href={cvHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.downloadCv}
            <LineIcon name="download" size={16} />
          </MintButton>
        </Channels>

        {section.practical && (
          <Practical aria-labelledby="praktycznie-title">
            <PracticalTitle id="praktycznie-title">
              {section.practical.title}
            </PracticalTitle>
            <Facts>
              {section.practical.items.map(({ label, value }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </Facts>
          </Practical>
        )}

        <Footer>
          <span>© {year} Krzysztof Gryc · Tychy</span>
          <span>{copy.footer}</span>
        </Footer>
      </Wrap>
    </Field>
  );
};

export default Contact;

const Field = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
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
  background: linear-gradient(currentColor, currentColor) 0 100% / 0% 3px
    no-repeat;
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

const Practical = styled.section`
  margin-top: clamp(48px, 6vw, 80px);
`;

const PracticalTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.mint};
`;

const Facts = styled.dl`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px 32px;

  dt {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.onFieldSoft};
  }

  dd {
    margin-top: 4px;
    font-weight: 600;
    text-wrap: balance;
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
