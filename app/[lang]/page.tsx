import { getContent } from '../../content';
import { SECTIONS, isLang } from '../../components/Home/copy';
import Nav from '../../components/Home/Nav';
import Opening from '../../components/Home/Opening';
import Hero from '../../components/Home/Hero';
import Recommendations from '../../components/Home/Recommendations';
import Experience from '../../components/Home/Experience';
import Projects from '../../components/Home/Projects';
import AboutStack from '../../components/Home/AboutStack';
import Contact from '../../components/Home/Contact';
import FloatingSquares from '../../components/Home/FloatingSquares';

// Komponent serwerowy: czyta treść dla języka z adresu i składa stronę
// z sekcji, do klienta trafiają tylko dane potrzebne danej sekcji
const Home = async ({ params }: PageProps<'/[lang]'>) => {
  const { lang } = await params;
  const { about, experience, projects, stack, recommendations, contact } =
    getContent(isLang(lang) ? lang : 'pl');
  // menu pomija sekcje, których dana wersja językowa nie ma
  const sections = SECTIONS.filter(({ id }) => id !== 'projekty' || projects);
  // rok w stopce z momentu builda, strona jest statyczna
  const buildYear = new Date().getFullYear();

  return (
    <>
      <Nav sections={sections} />
      <main>
        <Opening>
          <FloatingSquares />
          <Hero
            stack={stack}
            recommendations={recommendations.items}
            buildYear={buildYear}
          />
          <Recommendations section={recommendations} />
        </Opening>
        <Experience section={experience} />
        {projects && <Projects section={projects} />}
        <AboutStack
          about={about}
          groups={stack}
          tone={projects ? undefined : 'deep'}
        />
      </main>
      <Contact section={contact} buildYear={buildYear} />
    </>
  );
};

export default Home;
