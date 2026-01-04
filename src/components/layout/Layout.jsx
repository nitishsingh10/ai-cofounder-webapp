import { Share2, Sparkles } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import './Layout.css';

export default function Layout({ children, headerActions }) {
    return (
        <div className="layout">
            <header className="header">
                <div className="logo">
                    <Sparkles size={20} className="logo-icon" />
                    <span>Founding AI</span>
                </div>
                <nav className="header-nav">
                    {headerActions ? headerActions : (
                        <>
                            <ThemeToggle />
                            <a href="#" className="nav-link">About</a>
                        </>
                    )}
                </nav>
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
