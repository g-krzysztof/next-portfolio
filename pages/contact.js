import { Background } from '../styles';

import { MainContainer } from '../components/MainContainer';

const Contact = ({ data }) => {
  return (
    <>
      <MainContainer data={data} slugNext="contact" />
      <Background />
    </>
  );
};

export default Contact;

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
