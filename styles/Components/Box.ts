import styled from 'styled-components';
import {
  color,
  space,
  layout,
  flexbox,
  grid,
  border,
  shadow,
  position,
  background,
  typography,
  type ColorProps,
  type SpaceProps,
  type LayoutProps,
  type FlexboxProps,
  type GridProps,
  type BorderProps,
  type ShadowProps,
  type PositionProps,
  type BackgroundProps,
  type TypographyProps,
} from 'styled-system';

type BoxProps = ColorProps &
  SpaceProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  BorderProps &
  ShadowProps &
  PositionProps &
  BackgroundProps &
  TypographyProps;

export const Box = styled.div<BoxProps>`
  ${color};
  ${space};
  ${layout};
  ${flexbox};
  ${grid};
  ${border};
  ${shadow};
  ${position};
  ${background};
  ${typography};
`;
