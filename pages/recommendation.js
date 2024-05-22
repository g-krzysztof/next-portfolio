import { useContext, useEffect, useState } from 'react';
import { Background } from '../styles';
import { MainContainer } from '../components/MainContainer';
import { LangContext } from './_app';
import { fetchData } from '../helpers/fetchData';

const Recommendation = ({ dataPl, dataEn }) => {
  const [lang] = useContext(LangContext);
  const [data, setData] = useState(dataPl);

  useEffect(() => {
    if (lang === 'en') {
      setData(dataEn);
    }
    if (lang === 'pl') {
      setData(dataPl);
    }
  }, [lang]);

  return (
    <>
      <MainContainer data={data} slugNext="recommendation" />
      <Background />
    </>
  );
};

export default Recommendation;

export const getStaticProps = async () => {
  let dataPl;
  let dataEn;

  try {
    dataPl = await fetchData('pl');
    dataEn = await fetchData('en');
  } catch (e) {
    dataPl = [];
    dataEn = [];
  }

  return {
    props: {
      dataPl,
      dataEn,
    },
    revalidate: 1,
  };
};
