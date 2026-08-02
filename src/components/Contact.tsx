import type { ReactElement } from 'react';
import { contactLinks } from '../data/portfolio';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ICONS: Record<string, ReactElement> = {
    github: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 007.86 10.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.6.24 2.77.12 3.06.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .32.2.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
    ),
    email: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </svg>
    ),
};

export default function Contact() {
    const { ref, isVisible } = useScrollReveal<HTMLElement>();


    return (
        <section
            id="contact"
            ref={ref}
            className={`section contact reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
            <p className="section__eyebrow">Contact</p>
            <h2 className="section__title">
                Let's talk backend, fullstacks , internships, or anything in between.
            </h2>

            <div className="contact__links">
                {contactLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target={link.icon === 'email' ? undefined : '_blank'}
                        rel={link.icon === 'email' ? undefined : 'noreferrer'}
                        className="contact__link"
                    >
                        <span className="contact__icon">{ICONS[link.icon]}</span>
                        <span>
                            <span className="contact__label">{link.label}</span>
                            <span className="contact__value">{link.value}</span>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}