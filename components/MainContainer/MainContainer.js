import styled from 'styled-components';
import { Box, theme } from '../../styles';
import { MobileMenu } from '../../components/MobileMenu';
import { Menu } from '../../components/Menu';
import { Card } from '../../components/Card';
import { ContentContainer } from './ContentContainer';
import useBetterMediaQuery from '../../hooks/useBetterMediaQuery';

const MainContainer = ({ slugNext }) => {
  const laptopS = useBetterMediaQuery(
    `(min-width: ${theme.breakpoints.laptopS})`,
  );

  return (
    <StyledBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={{ _: 'column', laptopS: 'row' }}
    >
      {!laptopS && <MobileMenu />}
      {laptopS && <Menu />}
      {!laptopS && <div style={{ height: '300px' }}>mobile card</div>}
      {laptopS && <Card />}
      <ContentContainer slugNext={slugNext} laptopS={laptopS} />
    </StyledBox>
  );
};

export default MainContainer;

const StyledBox = styled(Box)`
  min-height: 100vh;
  width: 90%;
  margin: 0 auto;
`;
