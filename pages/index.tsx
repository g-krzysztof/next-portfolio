import type { GetStaticProps } from 'next';
import type { Content } from '../content/types';
import { SECTIONS, type Lang } from '../components/Home/copy';
import contentPl from '../content/pl.json';
import contentEn from '../content/en.json';
import Nav from '../components/Home/Nav';
import Hero from '../components/Home/Hero';
import Recommendations from '../components/Home/Recommendations';
import Experience from '../components/Home/Experience';
import Projects from '../components/Home/Projects';
import AboutStack from '../components/Home/AboutStack';
import Contact from '../components/Home/Contact';
import FloatingSquares from '../components/Home/FloatingSquares';
import styled from 'styled-components';

interface HomeProps {
  content: Content;
  buildYear: number;
}

const Home = ({ content, buildYear }: HomeProps) => {
  const { about, experience, projects, stack, recommendations, contact } =
    content;
  // menu pomija sekcje, których dana wersja językowa nie ma
  const sections = SECTIONS.filter(({ id }) => id !== 'projekty' || projects);

  return (
    <>
      <Nav sections={sections} />
      <main>
        <Opening>
          <FloatingSquares />
          <Hero stack={stack} recommendations={recommendations.items} />
          <Recommendations section={recommendations} />
        </Opening>
        <Experience section={experience} />
        {projects && <Projects section={projects} />}
        <AboutStack about={about} groups={stack} />
      </main>
      <Contact section={contact} buildYear={buildYear} />
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
// każda wersja językowa dostaje tylko swoją treść
const CONTENT = { pl: contentPl, en: contentEn } satisfies Record<
  Lang,
  Content
>;

// klucze _todo to notatki redakcyjne w JSON-ie; nie trafiają do HTML-a strony
const withoutTodos = (content: Content): Content =>
  JSON.parse(
    JSON.stringify(content, (key, value) =>
      key === '_todo' ? undefined : value,
    ),
  );

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  locale,
}) => ({
  props: {
    content: withoutTodos(CONTENT[locale === 'en' ? 'en' : 'pl']),
    buildYear: new Date().getFullYear(),
  },
});
