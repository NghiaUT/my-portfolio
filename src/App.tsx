import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__dot" />
        </div>
        <About />
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__dot" />
        </div>
        <Skills />
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__dot" />
        </div>
        <Projects />
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__dot" />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}