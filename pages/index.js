import React, { useContext } from 'react';
import { Background } from '../styles';
import { MainContainer } from '../components/MainContainer';
import { LangContext } from './_app';
import { fetchData, fetchRecommendations } from '../helpers/fetchData';

const Home = ({ dataPl, dataEn, recommendationsPl, recommendationsEn }) => {
  const [lang] = useContext(LangContext);
  const data = lang === 'en' ? dataEn : dataPl;
  const recommendations =
    lang === 'en' ? recommendationsEn : recommendationsPl;

  return (
    <>
      <MainContainer
        data={data}
        slugNext="main"
        recommendations={recommendations}
      />
      <Background />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  let dataPl;
  let dataEn;

  let recommendationsPl;
  let recommendationsEn;

  try {
    dataPl = await fetchData('pl');
    dataEn = await fetchData('en');
    recommendationsPl = await fetchRecommendations('pl');
    recommendationsEn = await fetchRecommendations('en');
  } catch (e) {
    dataPl = [];
    dataEn = [];
    recommendationsPl = [];
    recommendationsEn = [];
  }

  return {
    props: {
      dataPl,
      dataEn,
      recommendationsPl,
      recommendationsEn,
    },
    revalidate: 1,
  };
};
