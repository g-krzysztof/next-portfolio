import { Box, Background } from '../styles';
import useBetterMediaQuery from '../hooks/useBetterMediaQuery';
import styled from 'styled-components';

import { Card } from '../components/Card';
import { Menu } from '../components/Menu';
import { ContentContainer } from '../components/ContentContainer';

const Resume = () => {
  const modificationPage = useBetterMediaQuery('(min-width: 768px)');

  return (
    <>
      <StyledBox display="flex" justifyContent="center" alignItems="center">
        <Menu />
        <Card />
        <ContentContainer slugNext="resume" />
      </StyledBox>
      <Background />
    </>
  );
};

export default Resume;

const StyledBox = styled(Box)`
  min-height: 100vh;
  width: 90%;
  margin: 0 auto;
`;
