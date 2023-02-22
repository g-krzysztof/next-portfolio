import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import ReactLoading from 'react-loading';
import { useQuery } from 'react-query';
import { Box } from '../../styles';
import { useEffect, useState } from 'react';
import { theme } from '../../styles';

const fetchMainData = async () => {
  const res = await fetch(
    'https://strapi-portfolio-krzysztofg.herokuapp.com/api/page-contents',
  );
  return res.json();
};

const ContentContainer = ({ slugNext }) => {
  const { data } = useQuery('mainPage', fetchMainData);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
      });
    }
  }, [data]);

  return (
    <Container color="grey">
      {/*<Scrollbars>*/}
      <Box pr="space20" width="100%">
        {!data && <Box mt="space10"><ReactLoading type="spin" color={secondary} height={60} width={60} /></Box>}
        <Markdown
          options={{
            overrides: {
              h1: {
                component: Title,
              },
              primary: {
                component: StyledSpanPrimary,
              },
              secondary: {
                component: StyledSpanSecondary,
              },
            },
          }}
        >
          {title}
        </Markdown>
        <Paragraph>
          <Markdown
            options={{
              overrides: {
                h2: {
                  component: StyledBox,
                },
                primary: {
                  component: StyledSpanPrimary,
                },
                secondary: {
                  component: StyledSpanSecondary,
                },
              },
            }}
          >
            {content}
          </Markdown>
        </Paragraph>
      </Box>
      {/*</Scrollbars>*/}
    </Container>
  );
};

export default ContentContainer;

const Container = styled(Box)`
  flex-grow: 1;
  max-width: 1000px;
  display: flex;
  height: auto;
  min-height: 680px;
  background-color: white;
  border-radius: 0 5px 5px 0;
  margin: -16px 0 0 0;
  padding: 10px 10px 20px 20px;
  box-shadow: inset 20px 0 20px -20px rgba(0, 0, 0, 0.1);
  transition: 0.5s;
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 21px;
  line-height: 1.2;
  padding: 10px 0 12px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid #80cc7e;
  color: inherit;
  width: 100%;
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  padding-bottom: 20px;
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
