import React from 'react';
import Lottie from 'lottie-react';
import enFlag from './enFlag.json';
import { Box } from '../../styles';
import styled from 'styled-components'

const EnFlag = ({ onClick, width = '80px' }) => (
  <LottieWrapper width={width}>
    <Lottie onClick={onClick} animationData={enFlag} loop={true} />
  </LottieWrapper>
);

export default EnFlag;

const LottieWrapper = styled(Box)`
  width: ${({ width }) => width};
  cursor: pointer;
`;
