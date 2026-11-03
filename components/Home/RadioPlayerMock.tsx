import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { useLang } from './lang';

// Statyczny mockup playera radiowego (sam UI, bez odtwarzania) odtworzony
// ze wzorów: desktop 928×406 (stacja z listą wyboru po lewej, „teraz
// gramy” z okładką i przyciskiem odtwarzania po prawej) i mobile 380 px
// szerokości (to samo w jednej kolumnie, tu z marginesem 16 px, więc
// 412×372). Wymiary w --u jak w VideoPlayerMock. Logo, okładka i teksty
// to neutralne zamienniki. Dekoracja: kontrolki nie są fokusowalne.

const ACCENT = '#FF7900';

interface Props {
  designWidth?: number;
  mobile?: boolean;
}

const RadioPlayerMock = ({ designWidth = 928, mobile = false }: Props) => {
  const { copy } = useLang();
  const { radio, station, nowPlaying, track, artist } = copy.radioMock;

  return (
    <Player
      aria-hidden="true"
      style={{ '--design-width': designWidth } as CSSProperties}
    >
      <Card $m={mobile}>
        <Heading $m={mobile}>{radio}</Heading>
        <Panel>
          <Badge>{nowPlaying}</Badge>
          <Body $m={mobile}>
            <Stations $m={mobile}>
              <Logo $m={mobile}>LOGO</Logo>
              <Select $m={mobile}>
                <span>{station}</span>
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 7l7 7 7-7"
                    stroke="#000"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Select>
            </Stations>
            <Now $m={mobile}>
              <Cover $m={mobile} />
              <Info $m={mobile}>
                <Track $m={mobile}>{track}</Track>
                <Artist $m={mobile}>{artist}</Artist>
                <Play $m={mobile}>
                  <svg viewBox="0 0 36 43" fill="none">
                    <path
                      d="M3 6.3c0-3 3.3-4.9 5.9-3.3l23.6 15.3c2.3 1.5 2.3 4.9 0 6.4L8.9 40C6.3 41.6 3 39.7 3 36.7V6.3Z"
                      fill="#fff"
                    />
                  </svg>
                </Play>
              </Info>
            </Now>
          </Body>
        </Panel>
      </Card>
    </Player>
  );
};

export default RadioPlayerMock;

const u = (px: number) => `calc(var(--u) * ${px})`;

type M = { $m: boolean };

const Player = styled.div`
  position: absolute;
  inset: 0;
  container-type: inline-size;
  overflow: hidden;
  background: #fff;
  color: #000;
  font-family: var(--font-poppins), Poppins, system-ui, sans-serif;
  /* cqw odnosi się do kontenera nadrzędnego, więc --u liczą dopiero dzieci */
  > * {
    --u: calc(100cqw / var(--design-width));
  }
`;

const Card = styled.div<M>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ $m }) => u($m ? 16 : 20)};
`;

const Heading = styled.p<M>`
  font-size: ${({ $m }) => u($m ? 16 : 18)};
  font-weight: 600;
  line-height: ${({ $m }) => u($m ? 16 : 18)};
`;

const Panel = styled.div`
  position: relative;
  align-self: stretch;
  flex: 1;
  margin-top: ${u(24)};
  border-radius: ${u(16)};
  background: #f6f6f6;
`;

const Badge = styled.span`
  position: absolute;
  top: ${u(-12)};
  left: 50%;
  transform: translateX(-50%);
  height: ${u(24)};
  padding: 0 ${u(6)};
  border-radius: ${u(24)};
  background: ${ACCENT};
  color: #fff;
  font-size: ${u(12)};
  font-weight: 600;
  line-height: ${u(24)};
  white-space: nowrap;
`;

const Body = styled.div<M>`
  display: flex;
  gap: ${u(16)};
  padding: ${u(32)} ${u(32)} ${u(32)} ${u(16)};
  ${({ $m }) =>
    $m &&
    css`
      flex-direction: column;
      gap: ${u(12)};
      padding: ${u(24)} ${u(16)} ${u(16)};
    `}
`;

const Stations = styled.div<M>`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ $m }) =>
    $m
      ? css`
          gap: ${u(12)};
        `
      : css`
          width: ${u(269)};
          height: ${u(260)};
          justify-content: space-between;
          padding-top: ${u(33)};
        `}
`;

const Logo = styled.div<M>`
  display: grid;
  place-items: center;
  width: ${({ $m }) => u($m ? 56 : 112)};
  height: ${({ $m }) => u($m ? 56 : 112)};
  border-radius: 50%;
  background: ${ACCENT};
  color: #fff;
  font-size: ${({ $m }) => u($m ? 11 : 20)};
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Select = styled.div<M>`
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${u(32)};
  padding: 0 ${u(8)} 0 ${u(12)};
  margin-bottom: ${({ $m }) => ($m ? 0 : u(32))};
  font-size: ${u(14)};
  svg {
    width: ${u(20)};
    height: ${u(20)};
  }
  /* na mobile nazwa stacji stoi na środku, strzałka przy prawej krawędzi */
  ${({ $m }) =>
    $m &&
    css`
      justify-content: center;
      svg {
        position: absolute;
        right: ${u(8)};
      }
    `}
`;

const Now = styled.div<M>`
  flex: 1;
  display: flex;
  height: ${({ $m }) => u($m ? 148 : 260)};
  border-radius: ${u(12)};
  overflow: hidden;
  background: #fff;
`;

// Okładka: neutralny szary gradient zamiast zdjęcia płyty (jak poster w VideoPlayerMock)
const Cover = styled.div<M>`
  flex: none;
  width: ${({ $m }) => u($m ? 148 : 260)};
  height: ${({ $m }) => u($m ? 148 : 260)};
  border-radius: ${u(12)};
  background:
    radial-gradient(ellipse at 30% 35%, #c9d6df 0%, transparent 55%),
    radial-gradient(ellipse at 75% 70%, #8fa3b3 0%, transparent 60%),
    linear-gradient(135deg, #5d6d7e 0%, #a7b5c2 50%, #3e4a57 100%);
`;

const Info = styled.div<M>`
  position: relative;
  flex: 1;
  padding: ${({ $m }) => u($m ? 12 : 24)};
`;

const Track = styled.p<M>`
  font-size: ${({ $m }) => u($m ? 14 : 18)};
  font-weight: 600;
  line-height: ${({ $m }) => u($m ? 19.6 : 25)};
`;

const Artist = styled.p<M>`
  margin-top: ${u(4)};
  font-size: ${({ $m }) => u($m ? 14 : 18)};
  line-height: ${({ $m }) => u($m ? 19.6 : 25)};
`;

const Play = styled.span<M>`
  position: absolute;
  right: ${({ $m }) => u($m ? 12 : 24)};
  bottom: ${({ $m }) => u($m ? 12 : 24)};
  display: grid;
  place-items: center;
  width: ${({ $m }) => u($m ? 56 : 80)};
  height: ${({ $m }) => u($m ? 56 : 80)};
  padding-left: ${({ $m }) => u($m ? 3 : 4)};
  border-radius: 50%;
  background: ${ACCENT};
  svg {
    width: ${({ $m }) => u($m ? 20 : 36)};
    height: ${({ $m }) => u($m ? 24 : 43)};
  }
`;
