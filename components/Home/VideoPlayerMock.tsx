import type { CSSProperties } from 'react';
import styled from 'styled-components';

// Statyczny mockup playera wideo (sam UI, bez odtwarzania) odtworzony
// ze wzoru 932×524. Wymiary liczone w --u, czyli pikselach wzoru
// przeskalowanych do szerokości kontenera, więc w karuzeli całość
// zmniejsza się proporcjonalnie. designWidth to szerokość, przy której
// kontrolki mają wymiary 1:1 (932 dla 16:9, mniej dla pionu).
// Dekoracja: kontrolki nie są fokusowalne.

const CTRL_FILL = '#2B333F';
const CIRCLE_44 =
  'M0 22C0 9.85 9.85 0 22 0s22 9.85 22 22-9.85 22-22 22S0 34.15 0 22Z';

const VideoPlayerMock = ({ designWidth = 932 }: { designWidth?: number }) => (
  <Player
    aria-hidden="true"
    style={{ '--design-width': designWidth } as CSSProperties}
  >
    <Poster />
    <Dim />
    <BigPlay>
      <svg viewBox="0 0 88 88" fill="none">
        <path
          d="M0 44C0 19.7 19.7 0 44 0s44 19.7 44 44-19.7 44-44 44S0 68.3 0 44Z"
          fill={CTRL_FILL}
          fillOpacity=".7"
        />
        <path
          d="M34.04 27.57c-.93-.51-2.060-.49-2.97.05-.92.54-1.47 1.52-1.47 2.58v27.6c0 1.06.56 2.04 1.47 2.58.91.54 2.04.56 2.97.05l25.2-13.8c.96-.53 1.56-1.54 1.56-2.63s-.6-2.11-1.56-2.63L34.04 27.57Z"
          fill="#fff"
        />
      </svg>
    </BigPlay>

    <Side>
      <Btn>
        <svg viewBox="0 0 44 44" fill="none">
          <path d={CIRCLE_44} fill={CTRL_FILL} fillOpacity=".7" />
          <path
            d="M20 12 13.6 5v3.5C10.4 8.5 4 10.6 4 19c0-1.170 1.92-3.5 9.6-3.5V19L20 12Z"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            transform="translate(10 10)"
          />
        </svg>
      </Btn>
      <Btn>
        <svg viewBox="0 0 44 44" fill="none">
          <path d={CIRCLE_44} fill={CTRL_FILL} fillOpacity=".7" />
          <path
            d="M14.8 13.6c-.66 0-1.2.54-1.2 1.2v3.6c0 .66.54 1.2 1.2 1.2.66 0 1.2-.54 1.2-1.2V16h2.4c.66 0 1.2-.54 1.2-1.2 0-.66-.54-1.2-1.2-1.2h-3.6ZM16 25.6c0-.66-.54-1.2-1.2-1.2-.66 0-1.2.54-1.2 1.2v3.6c0 .66.54 1.2 1.2 1.2h3.6c.66 0 1.2-.54 1.2-1.2 0-.66-.54-1.2-1.2-1.2H16v-2.4Zm9.6-12c-.66 0-1.2.54-1.2 1.2 0 .66.54 1.2 1.2 1.2H28v2.4c0 .66.54 1.2 1.2 1.2.66 0 1.2-.54 1.2-1.2v-3.6c0-.66-.54-1.2-1.2-1.2h-3.6Zm4.8 12c0-.66-.54-1.2-1.2-1.2-.66 0-1.2.54-1.2 1.2V28h-2.4c-.66 0-1.2.54-1.2 1.2 0 .66.54 1.2 1.2 1.2h3.6c.66 0 1.2-.54 1.2-1.2v-3.6Z"
            fill="#fff"
          />
        </svg>
      </Btn>
    </Side>

    <Bar>
      <Row>
        <Vol>
          <VolPop>
            <VolBox>
              <VolRail>
                <VolLevel />
                <VolKnob />
              </VolRail>
            </VolBox>
          </VolPop>
          <Btn>
            <svg viewBox="0 0 44 44" fill="none">
              <path d={CIRCLE_44} fill={CTRL_FILL} fillOpacity=".7" />
              <path
                d="M13 25.6h1.8l5.03 4.47c.24.21.55.33.87.33.72 0 1.3-.59 1.3-1.31V14.9c0-.72-.58-1.3-1.3-1.3-.32 0-.63.12-.87.33L14.8 18.4H13c-.99 0-1.8.81-1.8 1.8v3.6c0 .99.81 1.8 1.8 1.8Zm12.47-6.390a.9.9 0 0 0-1.27.13.9.9 0 0 0 .13 1.27c.41.33.67.83.67 1.39s-.26 1.07-.66 1.4a.9.9 0 0 0-.13 1.27.9.9 0 0 0 1.27.13A3.6 3.6 0 0 0 26.8 22a3.6 3.6 0 0 0-1.33-2.79Z"
                fill="#fff"
              />
            </svg>
          </Btn>
        </Vol>
        <ProgressBox>
          <ProgressRail>
            <ProgressFill />
          </ProgressRail>
        </ProgressBox>
        <Time>00:21</Time>
      </Row>
    </Bar>
  </Player>
);

export default VideoPlayerMock;

const u = (px: number) => `calc(var(--u) * ${px})`;

const TRACK = 'rgba(255, 255, 255, 0.5)';
const CTRL_BG = 'rgba(43, 51, 63, 0.7)';

const Player = styled.div`
  position: absolute;
  inset: 0;
  container-type: inline-size;
  overflow: hidden;
  background: #000;
  /* cqw odnosi się do kontenera nadrzędnego, więc --u liczą dopiero dzieci */
  > * {
    --u: calc(100cqw / var(--design-width));
  }
`;

// Splash: docelowo neutralne zdjęcie przez background: url(...) center/cover
const Poster = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 35%, #c9d6df 0%, transparent 55%),
    radial-gradient(ellipse at 75% 70%, #8fa3b3 0%, transparent 60%),
    linear-gradient(135deg, #5d6d7e 0%, #a7b5c2 50%, #3e4a57 100%);
  transition: opacity 0.3s;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const BigPlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  svg {
    width: ${u(88)};
    height: ${u(88)};
  }
`;

const Btn = styled.span`
  display: flex;
  svg {
    width: ${u(44)};
    height: ${u(44)};
  }
`;

const Side = styled.div`
  position: absolute;
  right: ${u(12)};
  bottom: ${u(68)};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${u(16)};
  transition:
    opacity 0.3s,
    transform 0.3s;
`;

const Bar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${u(68)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${u(12)};
  background: linear-gradient(rgba(43, 51, 63, 0) 0%, ${CTRL_BG} 100%);
  transition:
    opacity 0.3s,
    transform 0.3s;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${u(16)};
`;

const VolPop = styled.div`
  position: absolute;
  bottom: ${u(44)};
  left: 0;
  width: ${u(44)};
  padding-bottom: ${u(8)};
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
`;

const Vol = styled.div`
  position: relative;
  width: ${u(44)};
  height: ${u(44)};
  &:hover ${VolPop} {
    opacity: 1;
    pointer-events: auto;
  }
`;

const VolBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${u(20)} ${u(10)};
  background: ${CTRL_BG};
  border-radius: ${u(40)};
`;

const VolRail = styled.div`
  position: relative;
  width: ${u(4)};
  height: ${u(120)};
  margin: 0 ${u(10)};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${TRACK};
  }
`;

const VolLevel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5%;
  background: #fff;
`;

const VolKnob = styled.div`
  position: absolute;
  left: ${u(2)};
  bottom: ${u(-4)};
  width: ${u(20)};
  height: ${u(20)};
  border-radius: 50%;
  background: #fff;
  transform: translateX(${u(-10)});
`;

const ProgressBox = styled.div`
  flex: 1;
  height: ${u(28)};
  display: flex;
  align-items: center;
`;

const ProgressRail = styled.div`
  position: relative;
  width: 100%;
  height: ${u(4)};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${TRACK};
  }
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 9%;
  background: #fff;
`;

const Time = styled.span`
  min-width: ${u(36)};
  font-family: var(--font-inter), Inter, sans-serif;
  font-weight: 700;
  font-size: ${u(14)};
  line-height: ${u(19.6)};
  color: #fff;
  text-align: center;
`;
