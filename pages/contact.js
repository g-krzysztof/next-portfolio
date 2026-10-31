import { useContext } from 'react';
import { Background } from '../styles';
import { MainContainer } from '../components/MainContainer';
import { fetchData } from '../helpers/fetchData';
import { LangContext } from './_app';

const Contact = ({ dataPl, dataEn }) => {
  const [lang] = useContext(LangContext);
  const data = lang === 'en' ? dataEn : dataPl;

  return (
    <>
      <MainContainer data={data} slugNext="contact" />
      <Background />
    </>
  );
};

export default Contact;

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
