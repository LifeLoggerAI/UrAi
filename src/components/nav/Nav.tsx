'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Nav.css';

const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/galaxy', label: 'Galaxy' },
    { href: '/replay', label: 'Replay' },
    { href: '/passport', label: 'Passport' },
];

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav className="unifiedNav">
            <div className="uraiMark">URAI</div>
            <div className="navLinks">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
