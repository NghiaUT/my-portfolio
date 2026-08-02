import { projects } from '../data/portfolio';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProjectCard from './Projectcard';

export default function Projects() {
    const { ref, isVisible } = useScrollReveal<HTMLElement>();

    return (
        <section
            id="projects"
            ref={ref}
            className={`section projects reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
            <p className="section__eyebrow">Projects</p>
            <h2 className="section__title">Things I've built</h2>

            <div className="projects__grid">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}