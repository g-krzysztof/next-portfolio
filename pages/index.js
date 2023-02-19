import { Box, Background } from '../styles';
import useBetterMediaQuery from '../hooks/useBetterMediaQuery';
import styled from 'styled-components';

import { Card } from '../components/Card';
import { Menu } from '../components/Menu';
import { ContentContainer } from '../components/ContentContainer'

const Home = () => {
  const modificationPage = useBetterMediaQuery('(min-width: 768px)');

  return (
    <>
      <StyledBox display="flex" justifyContent="center" alignItems="center">
        <Menu />
        <Card />
        <ContentContainer
          title={<Box display="flex"><Box color="secondary">Senior React</Box><Box ml="space5">Developer</Box></Box>}
          paragraphs={[
            { text: 'Cześć. Na imię mam Krzysiek, mieszkam w Tychach. <br/> Od ponad dziesięciu lat moja praca jest związana z projektowaniem i tworzeniem stron www.' },
            { text: 'Pracuję na stanowisku front-end developer. <br /> Zajmuję się tworzeniem oraz rozwijaniem projektów web i aplikacji.' },
            { text: 'W ostatnim czasie rozwijam front dużego projektu z backendem Symfony, <br /> korzystam między innymi z: <br /> React / Styled components / Sass / Twig / Cypress' },
          ]}
        />
      </StyledBox>
      <Background />
    </>
  );
};

export default Home;

const StyledBox = styled(Box)`
  min-height: 100vh;
  width: 90%;
  margin: 0 auto;
`;

