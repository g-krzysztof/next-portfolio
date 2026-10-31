import React from 'react';
import dynamic from 'next/dynamic';
import enFlag from './enFlag.json';
import { Box } from '../../styles';
import styled from 'styled-components';

// lottie-web touches `document` on import, so it must not be loaded during SSR
const Lottie = dynamic(
  () => import('lottie-react').then((mod) => mod.Lottie),
  { ssr: false },
);

const EnFlag = ({ onClick, width = '80px' }) => (
  <LottieWrapper $width={width} onClick={onClick}>
    <Lottie src={enFlag} autoplay loop />
  </LottieWrapper>
);

export default EnFlag;

const LottieWrapper = styled(Box)`
  width: ${({ $width }) => $width};
  cursor: pointer;
`;
