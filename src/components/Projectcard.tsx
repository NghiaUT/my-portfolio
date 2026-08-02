import type { Project } from "../types/index.type";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article className="project-card">
            <div className="project-card__header">
                <h3 className="project-card__title">{project.title}</h3>
                {project.role && (
                    <span className="project-card__role">{project.role}</span>
                )}
            </div>

            <p className="project-card__description">{project.description}</p>

            <ul className="project-card__highlights">
                {project.highlights.map((point) => (
                    <li key={point}>{point}</li>
                ))}
            </ul>

            <ul className="project-card__tech">
                {project.techStack.map((tech) => (
                    <li key={tech}>{tech}</li>
                ))}
            </ul>

            <div className="project-card__links">
                <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--outline btn--small"
                >
                    {project.secondaryRepoUrl ? 'Frontend Repo' : 'View Repo'}
                </a>

                {project.secondaryRepoUrl && (
                    <a
                        href={project.secondaryRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--outline btn--small"
                    >
                        {project.secondaryRepoLabel ?? 'Backend Repo'}
                    </a>
                )}

                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--primary btn--small"
                    >
                        Live Demo
                    </a>
                )}
            </div>
        </article>
    );
}