import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import { Paragraph } from '../MainContainer/ContentContainer/ContentContainer';
import { Box } from '../../styles';
import {
  StyledSpanPrimary,
  StyledSpanSecondary,
} from '../MainContainer/ContentContainer/ContentContainer';
import { useContext, useEffect } from 'react';
import { LangContext } from '../../pages/_app';
import { useState } from 'react';
import useInterval from '../../hooks/useInterval';

const COUNTER_SECONDS = 8;

const RecommendationSlider = ({ recommendations }) => {
  const [lang] = useContext(LangContext);
  const [activeRecommendation, setActiveRecommendation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [counter, setCounter] = useState(COUNTER_SECONDS);

  useEffect(() => {
    setActiveRecommendation(activeRecommendation);
  }, [recommendations, activeRecommendation]);

  useInterval(() => {
    if (isPaused) return;
    if (counter > 0) {
      setCounter(counter - 1);
    } else {
      setCounter(COUNTER_SECONDS);
    }
    if (counter === 0) {
      if (recommendations?.data?.length > activeRecommendation + 1) {
        setActiveRecommendation(activeRecommendation + 1);
      } else {
        setActiveRecommendation(0);
      }
    }
  }, 1000);

  const handleOnPlayClick = () => {
    setIsPaused(!isPaused);
    if (isPaused === false) {
      setCounter(COUNTER_SECONDS);
    }
  };

  const markdownOptions = {
    overrides: {
      h1: {
        component: RecommendationTitle,
      },
      h2: {
        component: Space,
      },
      h3: {
        component: ContentBox,
      },
      h4: {
        component: AuthorBox,
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
    <Paragraph mr="space20" mt="space30">
      <Box position="relative">
        <ButtonsWrapper>
          <CounterWrapper>{counter + 1}</CounterWrapper>
          <PlayButton onClick={() => handleOnPlayClick()}>
            {isPaused ? 'START' : 'STOP'}
          </PlayButton>
          {recommendations.data.map((recommendation, index) => (
            <DotButton
              key={recommendation.id}
              onClick={() => setActiveRecommendation(index)}
              isActive={activeRecommendation === index}
            />
          ))}
        </ButtonsWrapper>
        <Markdown options={markdownOptions}>
          {`# ${
            lang === 'pl'
              ? 'Opinie i rekomendacje'
              : 'Opinions and recommendations'
          }`}
        </Markdown>
      </Box>
      <Markdown options={markdownOptions}>
        {recommendations?.data[activeRecommendation]?.attributes?.text || ''}
      </Markdown>
    </Paragraph>
  );
};

export default RecommendationSlider;

const CounterWrapper = styled(Box)`
  border: 1px solid #888;
  padding: 0 6px;
  background: transparent;
  color: #888;
  font-size: 11px;
  border-radius: 6px;
  margin-top: -2px;
  height: 22px;
  width: 22px;
  margin-right: 8px;
  font-family: Arial, serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButton = styled(Box)`
  border: 1px solid #888;
  padding: 0 6px;
  cursor: pointer;
  background: transparent;
  color: #555;
  font-weight: bold;
  font-size: 11px;
  border-radius: 6px;
  margin-top: -2px;
  height: 22px;
  :hover {
    color: #111;
  }
`;

const DotButton = styled(Box)`
  height: 16px;
  width: 16px;
  background: ${({ theme: { colors }, isActive }) =>
    isActive ? colors.secondary : colors.primary};
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 10px;
  transition: 0.2s;
  :hover {
    background: ${({ theme: { colors } }) => colors.secondary};
  }
`;

const ButtonsWrapper = styled(Box)`
  display: flex;
  justify-content: right;
  position: absolute;
  top: 14px;
  right: 0;
`;

export const RecommendationTitle = styled.h1`
  font-weight: 800;
  font-size: 18px;
  line-height: 1.2;
  padding: 10px 0 12px 0;
  margin-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.secondary};
  color: inherit;
  width: 100%;
`;

export const ContentBox = styled(Box)`
  font-style: italic;
  padding-bottom: ${({ theme: { space } }) => space.space5};
`;

export const AuthorBox = styled(Box)`
  padding-top: 3px;
  text-align: right;
`;

export const Space = styled(Box)`
  height: 20px;
`;
