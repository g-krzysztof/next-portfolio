import { useContext, useEffect, useState } from 'react';
import { Background } from '../styles';
import { MainContainer } from '../components/MainContainer';
import { LangContext } from './_app';
import { fetchData, fetchRecommendations } from '../helpers/fetchData';

const Recommendation = ({
  dataPl,
  dataEn,
  recommendationsPl,
  recommendationsEn,
}) => {
  const [lang] = useContext(LangContext);
  const [data, setData] = useState(dataPl);
  const [recommendations, setRecommendations] = useState(recommendationsPl);

  useEffect(() => {
    if (lang === 'en') {
      setData(dataEn);
      setRecommendations(recommendationsEn);
    }
    if (lang === 'pl') {
      setData(dataPl);
      setRecommendations(recommendationsPl);
    }
  }, [lang]);

  return (
    <>
      <MainContainer
        data={data}
        slugNext="recommendation"
        recommendations={recommendations}
      />
      <Background />
    </>
  );
};

export default Recommendation;

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
