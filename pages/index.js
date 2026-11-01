import { useContext } from 'react';
import { LangContext } from './_app';
import contentPl from '../content/pl.json';
import contentEn from '../content/en.json';
import Nav from '../components/Home/Nav';
import Hero from '../components/Home/Hero';
import Recommendations from '../components/Home/Recommendations';
import Experience from '../components/Home/Experience';
import AboutStack from '../components/Home/AboutStack';
import Contact from '../components/Home/Contact';
import FloatingSquares from '../components/Home/FloatingSquares';
import styled from 'styled-components';

const Home = ({ content }) => {
  const [lang] = useContext(LangContext);
  const { about, experience, stack, recommendations, contact } = content[lang];

  return (
    <>
      <Nav />
      <main>
        <Opening>
          <FloatingSquares />
          <Hero stack={stack} recommendations={recommendations.items} />
          <Recommendations section={recommendations} />
        </Opening>
        <Experience section={experience} />
        <AboutStack about={about} groups={stack} />
      </main>
      <Contact section={contact} />
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

// treść jest w repo, więc strona buduje się statycznie bez zewnętrznych zapytań
export const getStaticProps = async () => ({
  props: {
    content: { pl: contentPl, en: contentEn },
  },
});
