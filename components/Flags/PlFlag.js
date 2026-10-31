import React from 'react';
import dynamic from 'next/dynamic';
import plFlag from './plFlag.json';
import { Box } from '../../styles';
import styled from 'styled-components';

// lottie-web touches `document` on import, so it must not be loaded during SSR
const Lottie = dynamic(
  () => import('lottie-react').then((mod) => mod.Lottie),
  { ssr: false },
);

const PlFlag = ({ onClick, width = '80px' }) => (
  <LottieWrapper $width={width} onClick={onClick}>
    <Lottie src={plFlag} autoplay loop />
  </LottieWrapper>
);

export default PlFlag;

const LottieWrapper = styled(Box)`
  width: ${({ $width }) => $width};
  cursor: pointer;
`;
