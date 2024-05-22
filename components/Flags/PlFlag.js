import React from 'react';
import Lottie from 'lottie-react';
import plFlag from './plFlag.json';
import { Box } from '../../styles';
import styled from 'styled-components';

const PlFlag = ({ onClick, width = '80px' }) => (
  <LottieWrapper width={width}>
    <Lottie onClick={onClick} animationData={plFlag} loop={true} />
  </LottieWrapper>
);

export default PlFlag;

const LottieWrapper = styled(Box)`
  width: ${({ width }) => width};
  cursor: pointer;
`;
