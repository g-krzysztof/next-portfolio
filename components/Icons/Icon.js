import styled from 'styled-components';
import { Box } from '../../styles';
import icons from './icons';

const Icon = ({ iconName, size = '26px', ...props }) => {
  const { viewBox, path } = icons[iconName];

  return (
    <IconWrapper size={size} {...props}>
      <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
        <path fill="currentColor" d={path}></path>
      </svg>
    </IconWrapper>
  );
};

export default Icon;

const IconWrapper = styled(Box)`
  width: ${({ size }) => size};
`;
