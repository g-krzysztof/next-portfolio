import { Background } from '../styles';

import { MainContainer } from '../components/MainContainer';

const Home = ({ data }) => {
  return (
    <>
      <MainContainer data={data} slugNext="main" />
      <Background />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  let data;

  const fetchMainData = async () => {
    const res = await fetch(
      'https://strapi-portfolio-krzysztofg.herokuapp.com/api/page-contents',
    );
    return res.json();
  };

  try {
    data = await fetchMainData();
  } catch (e) {
    data = [];
  }

  return {
    props: {
      data,
    },
    revalidate: 1,
  };
};
