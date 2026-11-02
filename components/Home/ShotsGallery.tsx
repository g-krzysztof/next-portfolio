import { useState } from 'react';
import styled from 'styled-components';
import type { ProjectShot } from '../../content/types';
import { useLang } from './lang';

// proporcje zrzutów w public/images/projects (1400 × 1031)
const RATIO = '1400 / 1031';

// Zrzuty ekranu projektu: duży kadr w oknie przeglądarki, pod nim pasek miniatur.
// Kadry leżą jeden na drugim i przenikają się, więc zmiana nie skacze wysokością.
// Bez autoprzewijania – to galeria do oglądania, nie pokaz.
const ShotsGallery = ({
  shots,
  site,
}: {
  shots: ProjectShot[];
  site?: string;
}) => {
  const { copy } = useLang();
  const [index, setIndex] = useState(0);
  const shot = shots[index];

  return (
    <Figure aria-label={copy.projectShots}>
      <Frame>
        <Bar aria-hidden="true">
          <Dots>
            <i />
            <i />
            <i />
          </Dots>
          {site && <Address>{site}</Address>}
        </Bar>
        <Stage>
          {shots.map(({ src, alt }, i) => (
            <Shot
              key={src}
              src={src}
              alt={i === index ? alt : ''}
              aria-hidden={i !== index}
              $active={i === index}
              width={1400}
              height={1031}
              loading="lazy"
              decoding="async"
            />
          ))}
        </Stage>
      </Frame>

      <Caption>
        <Count>
          {String(index + 1).padStart(2, '0')}
          <span> / {String(shots.length).padStart(2, '0')}</span>
        </Count>
        {shot.caption}
      </Caption>

      <Strip style={{ '--n': shots.length } as React.CSSProperties}>
        {shots.map(({ src, label }, i) => (
          <Pick
            key={src}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            <Thumb>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </Thumb>
            <PickLabel>{label}</PickLabel>
          </Pick>
        ))}
      </Strip>
    </Figure>
  );
};

export default ShotsGallery;

const Figure = styled.figure`
  margin: 0;
`;

const Frame = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.control};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: #fff;
  box-shadow:
    0 1px 2px rgba(16, 32, 31, 0.06),
    0 18px 40px -18px rgba(16, 32, 31, 0.28);
`;

// pasek okna przeglądarki: zrzut czyta się jako żywa strona, nie ilustracja
const Bar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.paper};
`;

const Dots = styled.span`
  display: flex;
  gap: 6px;
  i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.line};
  }
`;

const Address = styled.span`
  justify-self: center;
  min-width: 0;
  max-width: 100%;
  padding: 3px 14px;
  border-radius: 99px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.inkMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Stage = styled.div`
  display: grid;
  aspect-ratio: ${RATIO};
  > * {
    grid-area: 1 / 1;
  }
`;

const Shot = styled.img<{ $active: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: scale(${({ $active }) => ($active ? 1 : 1.015)});
  transition:
    opacity 0.45s ${({ theme }) => theme.ease.out},
    transform 0.6s ${({ theme }) => theme.ease.out};
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

const Caption = styled.figcaption`
  display: flex;
  gap: 12px;
  align-items: baseline;
  min-height: 3em;
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Count = styled.span`
  flex: none;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.tealInk};
  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.inkMuted};
  }
`;

// jedna linia miniatur; na wąskim ekranie przewija się w bok
const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(84px, 1fr));
  gap: 10px;
  margin-top: 12px;
  padding: 4px 4px 6px;
  margin-inline: -4px;
  overflow-x: auto;
  scrollbar-width: thin;
`;

const Thumb = styled.span`
  display: block;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: #fff;
  aspect-ratio: ${RATIO};
  transition:
    border-color 0.2s ${({ theme }) => theme.ease.out},
    box-shadow 0.2s ${({ theme }) => theme.ease.out},
    transform 0.25s ${({ theme }) => theme.ease.out};
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    opacity: 0.6;
    transition: opacity 0.2s ${({ theme }) => theme.ease.out};
  }
`;

const PickLabel = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Pick = styled.button`
  padding: 0;
  text-align: left;
  @media (hover: hover) {
    &:hover ${Thumb} {
      border-color: ${({ theme }) => theme.colors.tealInk};
      transform: translateY(-2px);
    }
    &:hover img {
      opacity: 1;
    }
  }
  &[aria-pressed='true'] {
    ${Thumb} {
      border-color: ${({ theme }) => theme.colors.tealInk};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.mint};
    }
    img {
      opacity: 1;
    }
    ${PickLabel} {
      color: ${({ theme }) => theme.colors.ink};
    }
  }
  @media (prefers-reduced-motion: reduce) {
    ${Thumb}, img {
      transition: none;
    }
    &:hover ${Thumb} {
      transform: none;
    }
  }
`;
