import { useScrollReveal } from "../hooks/useScrollReveal";

export default function About() {
    const { ref, isVisible } = useScrollReveal<HTMLElement>();

    return (
        <section
            id="about"
            ref={ref}
            className={`section about reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
            <p className="section__eyebrow">About</p>
            <h2 className="section__title">
                A backend-leaning builder, still learning on purpose.
            </h2>

            <div className="about__body">
                <p>
                    I'm a final-year Computer Science student at Ho Chi Minh City
                    University of Technology (HCMUT / BKU), spending most of my time on
                    the parts of an app people don't see — APIs, data models, and the
                    systems that keep them consistent under load.
                </p>
                <p>
                    That interest took shape through an internship at NUS Technology,
                    where I shipped a full-stack monorepo end to end, and through
                    university projects where I moved between requirements-gathering
                    and hands-on development. I'm drawn to backend engineering because
                    I like reasoning about correctness — what happens when two requests
                    hit at once, what happens when a step fails halfway through... Wanna find out more about me?
                </p>
            </div>
        </section>
    );
}