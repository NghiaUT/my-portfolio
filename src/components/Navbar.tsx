import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <a href="#hero" className="navbar__brand">
                nghia<span className="navbar__brand-dot">.</span>dev
            </a>

            <nav className="navbar__links">
                {NAV_LINKS.map((link) => (
                    <a key={link.href} href={link.href} className="navbar__link">
                        {link.label}
                    </a>
                ))}
            </nav>

            <ThemeToggle />
        </header>
    );
}