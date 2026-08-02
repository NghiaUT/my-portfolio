import { skillGroups } from '../data/portfolio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
    const { ref, isVisible } = useScrollReveal<HTMLElement>();

    return (
        <section
            id="skills"
            ref={ref}
            className={`section skills reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
            <p className="section__eyebrow">Skills</p>
            <h2 className="section__title">Tools I reach for</h2>

            <div className="skills__grid">
                {skillGroups.map((group) => (
                    <div key={group.category} className="skills__group">
                        <h3 className="skills__category">{group.category}</h3>
                        <ul className="skills__tags">
                            {group.items.map((item) => (
                                <li key={item} className="skills__tag">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}