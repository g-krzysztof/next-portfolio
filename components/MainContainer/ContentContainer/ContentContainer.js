import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import SimpleBar from 'simplebar-react';
import ReactLoading from 'react-loading';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { Box, theme } from '../../../styles';
import 'simplebar-react/dist/simplebar.min.css';

const fetchMainData = async () => {
  const res = await fetch(
    'https://strapi-portfolio-krzysztofg.herokuapp.com/api/page-contents',
  );
  return res.json();
};

const ContentContainer = ({ slugNext, laptopS }) => {
  const { data } = useQuery('mainPage', fetchMainData);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skillsTitle, setSkillsTitle] = useState('');
  const [skillsContent, setSkillsContent] = useState('');

  const secondary = theme.colors.secondary;

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

  const markdownOptions = {
    overrides: {
      h1: {
        component: Title,
      },
      h2: {
        component: SubtitleWrapper,
      },
      h3: {
        component: StyledBox,
      },
      h4: {
        component: SkillsTitleWrapper,
      },
      primary: {
        component: StyledSpanPrimary,
      },
      secondary: {
        component: StyledSpanSecondary,
      },
    },
  };

  return (
    <Container
      color="grey"
      width={{ _: '100%', laptopS: '500px', desktop: '1000px' }}
      height={{ _: 'auto', laptopS: '600px' }}
      laptopS={laptopS}
    >
      <StyledSimpleBar style={{ maxHeight: laptopS ? 650 : 'unset' }}>
        <Box display="flex" flexDirection={{ _: 'column', desktop: 'row' }}>
          <Box
            pr={laptopS ? 'space20' : 'space10'}
            width={{ _: '100%', desktop: '70%' }}
          >
            {!data && (
              <Box mt="space10">
                <ReactLoading
                  type="spin"
                  color={secondary}
                  height={60}
                  width={60}
                />
              </Box>
            )}
            {data && (
              <>
                <Markdown options={markdownOptions}>{title}</Markdown>
                <Paragraph mr="space20">
                  <Markdown options={markdownOptions}>{content}</Markdown>
                </Paragraph>
              </>
            )}
          </Box>
          <Box width={{ _: '100%', desktop: '30%' }}>
            {data && (
              <Box mr={laptopS ? 'space20' : 'space10'}>
                <Markdown options={markdownOptions}>{skillsTitle}</Markdown>
                <Paragraph backgroundColor="backgroundLight" px="space20">
                  <Markdown options={markdownOptions}>{skillsContent}</Markdown>
                </Paragraph>
              </Box>
            )}
          </Box>
        </Box>
      </StyledSimpleBar>
    </Container>
  );
};

export default ContentContainer;

const SubtitleWrapper = ({ children }) => (
  <Box display="flex">
    <Subtitle>{children}</Subtitle>
  </Box>
);

const SkillsTitleWrapper = ({ children }) => (
  <Box display="flex">
    <SkillsTitle>{children}</SkillsTitle>
  </Box>
);

const Container = styled(Box)`
  flex-grow: 1;
  max-width: 1000px;
  display: flex;
  min-height: 680px;
  background-color: white;
  padding: 10px 10px 20px 20px;
  transition: 0.5s;
  ${({ laptopS }) => `
      box-shadow: ${
        laptopS ? 'inset 20px 0 20px -20px rgba(0, 0, 0, 0.1)' : 'none'
      };
      margin: ${laptopS ? '-16px 0 0 0' : '-16px 0 20px 0'};
      border-radius: ${laptopS ? '0 5px 5px 0' : '0'};
    `};
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 21px;
  line-height: 1.2;
  padding: 10px 0 12px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.secondary};
  color: inherit;
  width: 100%;
`;

const Subtitle = styled.h2`
  font-weight: 800;
  font-size: 16px;
  line-height: 1.2;
  padding: 30px 200px 6px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.primary};
  color: inherit;
`;

const SkillsTitle = styled.h4`
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
  padding: 30px 0 6px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.secondary};
  color: inherit;
`;

const Paragraph = styled(Box)`
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  padding-bottom: 20px;
  u {
    text-decoration: none;
    padding-bottom: 2px;
    margin-bottom: -2px;
    border-bottom: 1px solid ${({ theme: { colors } }) => colors.primary};
  }
  li {
    margin-left: 16px;
  }
`;

const StyledBox = styled(Box)`
  padding-top: ${({ theme: { space } }) => space.space20};
`;

const StyledSpanPrimary = styled.span`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: 600;
`;

const StyledSpanSecondary = styled.span`
  color: ${({ theme: { colors } }) => colors.secondary};
  font-weight: 600;
`;

const StyledSimpleBar = styled(SimpleBar)`
  width: 100%;
  .simplebar-track.simplebar-vertical {
    width: 8px;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
  .simplebar-scrollbar {
    background-color: white;
    border: 1px solid grey;
    border-radius: 4px;
    color: white;
    :before {
      color: white;
      background: white;
    }
  }
`;
