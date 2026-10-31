import { useContext } from 'react';
import { LangContext } from './_app';
import { fetchData, fetchRecommendations } from '../helpers/fetchData';
import Nav from '../components/Home/Nav';
import Hero from '../components/Home/Hero';
import Recommendations from '../components/Home/Recommendations';
import Experience from '../components/Home/Experience';
import AboutStack from '../components/Home/AboutStack';
import Contact from '../components/Home/Contact';
import FloatingSquares from '../components/Home/FloatingSquares';
import styled from 'styled-components';
import {
  parseRecommendations,
  parseSkills,
  pickPage,
} from '../components/Home/parse';

const Home = ({ content, recommendations }) => {
  const [lang] = useContext(LangContext);
  const data = content[lang];
  const skills = pickPage(data, 'skills');
  const stack = parseSkills(skills?.content);
  const recs = parseRecommendations(recommendations[lang]);

  return (
    <>
      <Nav />
      <main>
        <Opening>
          <FloatingSquares />
          <Hero stack={stack} recommendations={recs} />
          <Recommendations
            page={pickPage(data, 'recommendation')}
            items={recs}
          />
        </Opening>
        <Experience page={pickPage(data, 'resume')} />
        <AboutStack page={pickPage(data, 'main')} groups={stack} />
      </main>
      <Contact page={pickPage(data, 'contact')} />
    </>
  );
};

export default Home;

// Hero i talia opinii to jedno turkusowe pole: wspólne tło pozwala kwadratom
// przepływać przez granicę sekcji bez ucięcia
const Opening = styled.div`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.field};
`;

const safely = async (request) => {
  try {
    return await request;
  } catch (e) {
    return { data: [] };
  }
};

export const getStaticProps = async () => {
  const [dataPl, dataEn, recommendationsPl, recommendationsEn] =
    await Promise.all([
      safely(fetchData('pl')),
      safely(fetchData('en')),
      safely(fetchRecommendations('pl')),
      safely(fetchRecommendations('en')),
    ]);

  return {
    props: {
      content: { pl: dataPl, en: dataEn },
      recommendations: { pl: recommendationsPl, en: recommendationsEn },
    },
    revalidate: 60,
  };
};
