import { useContext } from 'react';
import { LangContext } from './_app';
import { fetchData, fetchRecommendations } from '../helpers/fetchData';
import Nav from '../components/Home/Nav';
import Hero from '../components/Home/Hero';
import Recommendations from '../components/Home/Recommendations';
import Experience from '../components/Home/Experience';
import AboutStack from '../components/Home/AboutStack';
import Contact from '../components/Home/Contact';
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
        <Hero stack={stack} recommendations={recs} />
        <Recommendations
          page={pickPage(data, 'recommendation')}
          items={recs}
        />
        <Experience page={pickPage(data, 'resume')} />
        <AboutStack page={pickPage(data, 'main')} groups={stack} />
      </main>
      <Contact page={pickPage(data, 'contact')} />
    </>
  );
};

export default Home;

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
