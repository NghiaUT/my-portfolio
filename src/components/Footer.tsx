import { contactLinks } from '../data/portfolio';

export default function Footer() {
    const year = new Date().getFullYear();
    const github = contactLinks.find((link) => link.icon === 'github');
    const linkedin = contactLinks.find((link) => link.icon === 'linkedin');

    return (
        <footer className="footer">
            <p>&copy; {year} Trọng Nghĩa. Built with React, TypeScript &amp; three.js.</p>

            <div className="footer__links">
                {github && (
                    <a href={github.href} target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                )}
                {linkedin && (
                    <a href={linkedin.href} target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                )}
            </div>
        </footer>
    );
}