import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { LOCALES, isLang, t } from '../../components/Home/copy';
import { theme } from '../../styles/theme';

// Podgląd linku (og:image) dla LinkedIn, Slacka i Teams, osobno dla każdej
// wersji językowej; generowany przy buildzie razem ze stroną
export const alt = 'Krzysztof Gryc – Senior React Frontend Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

const { colors } = theme;

const OpenGraphImage = async ({ params }: PageProps<'/[lang]'>) => {
  const { lang } = await params;
  const copy = t(isLang(lang) ? lang : 'pl');
  const avatar = await readFile(
    join(process.cwd(), 'public/images/avatar-kriss.png'),
  );
  const avatarSrc = `data:image/png;base64,${avatar.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 72,
          padding: '0 96px',
          background: colors.field,
          color: colors.onField,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt=""
          width={340}
          height={340}
          style={{ borderRadius: 9999, border: `8px solid ${colors.mint}` }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Krzysztof Gryc
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 40,
              color: colors.mint,
              lineHeight: 1.2,
            }}
          >
            {copy.role}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: colors.onFieldSoft,
              lineHeight: 1.4,
            }}
          >
            {copy.ogTagline}
          </div>
          <div
            style={{
              marginTop: 44,
              fontSize: 26,
              color: colors.teal,
            }}
          >
            krzysztofg.pl
          </div>
        </div>
      </div>
    ),
    size,
  );
};

export default OpenGraphImage;
