import styled from 'styled-components';
// import { useQuery } from 'react-query';
import { Box, theme } from '../../styles';
import { Menu, MobileMenu } from '../../components/Menu';
import { Card, MobileCard } from '../../components/Card';
import { ContentContainer, MobileContentContainer } from './ContentContainer';
import useBetterMediaQuery from '../../hooks/useBetterMediaQuery';
import { useEffect, useState } from 'react';

// const fetchMainData = async () => {
//   const res = await fetch(
//     'https://strapi-portfolio-krzysztofg.herokuapp.com/api/page-contents',
//   );
//   return res.json();
// };

const MainContainer = ({ data, slugNext }) => {
  // const { data } = useQuery('mainPage', fetchMainData);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skillsTitle, setSkillsTitle] = useState('');
  const [skillsContent, setSkillsContent] = useState('');

  useEffect(() => {
    if (data && data.data) {
      const contentArray = data.data;
      contentArray.map(({ attributes }) => {
        const { title, content, slug } = attributes;
        if (slug === slugNext) {
          setTitle(title);
          setContent(content);
        }
        if (slug === 'skills') {
          setSkillsTitle(title);
          setSkillsContent(content);
        }
      });
    }
  }, [data, slugNext]);

  const laptopS = useBetterMediaQuery(
    `(min-width: ${theme.breakpoints.laptopS})`,
  );

  const minHeight = useBetterMediaQuery(
    `(min-height: ${theme.breakpoints.minHeight})`,
  );

  return (
    <>
      {laptopS !== null && minHeight !== null &&
        <StyledBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={!laptopS || !minHeight ? 'column' : 'row'}
        >
          {(!laptopS || !minHeight) && (
            <>
              <MobileMenu />
              <MobileCard />
              <MobileContentContainer
                title={title}
                content={content}
                skillsTitle={skillsTitle}
                skillsContent={skillsContent}
              />
            </>
          )}
          {laptopS && minHeight && (
            <>
              <Menu />
              <Card />
              <ContentContainer
                title={title}
                content={content}
                skillsTitle={skillsTitle}
                skillsContent={skillsContent}
                laptopS={laptopS}
              />
            </>
          )}
        </StyledBox>
      }
    </>
  );
};

export default MainContainer;

const StyledBox = styled(Box)`
  min-height: 100vh;
  width: 90%;
  margin: 0 auto;
`;
