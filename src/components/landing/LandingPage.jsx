import React, { useEffect } from 'react';
import { ArrowRight, ChevronRight, Activity, Zap, CheckCircle, Database, Layers, ArrowUpRight, Sparkles } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import './LandingPage.css';

const LandingPage = ({ onStart }) => {
    // Scroll reveal effect setup
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-page">
            {/* 1. HERO */}
            <section className="lp-hero">
                <nav className="lp-nav">
                    <div className="lp-logo">
                        <Sparkles size={22} className="lp-logo-icon" />
                        <span>Founding AI</span>
                    </div>
                    <div className="lp-nav-links">
                        <a href="#problem">The Problem</a>
                        <a href="#how-it-works">How it Works</a>
                        <ThemeToggle />
                        <button className="lp-nav-cta" onClick={onStart}>Run AI Team</button>
                    </div>
                </nav>

                <div className="lp-hero-content animate-fade-up">
                    <div className="lp-label">Founding AI</div>
                    <h1 className="lp-headline">
                        An AI operating system<br />for founders.
                    </h1>
                    <p className="lp-subheadline">
                        Founding AI is a team of autonomous AI agents that help founders<br />
                        launch, operate, and make decisions — every day.
                    </p>
                    <div className="lp-cta-group">
                        <button className="lp-btn-primary" onClick={onStart}>
                            Run the AI Team <ArrowRight size={16} />
                        </button>
                        <button className="lp-btn-secondary">
                            See how it works
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. THE PROBLEM */}
            <section id="problem" className="lp-section lp-problem reveal-on-scroll">
                <div className="lp-container lp-grid-2">
                    <div className="lp-text-content">
                        <h2 className="lp-section-title">Founders don’t struggle with ideas. They struggle with decisions.</h2>
                        <ul className="lp-problem-list">
                            <li>Too many decisions every day</li>
                            <li>No clear priorities</li>
                            <li>Conflicting advice</li>
                            <li>Context switching between tools</li>
                            <li>No single source of truth</li>
                        </ul>
                        <p className="lp-problem-close">"Most tools answer questions. None take responsibility for decisions."</p>
                    </div>
                    <div className="lp-visual-divider">
                        {/* Abstract visual or divider line could go here */}
                        <div className="lp-line-vertical"></div>
                    </div>
                </div>
            </section>

            {/* 3. POSITIONING */}
            <section className="lp-section lp-positioning reveal-on-scroll">
                <div className="lp-container centered">
                    <h3 className="lp-section-label">What is Founding AI?</h3>
                    <div className="lp-positioning-content">
                        <p>Founding AI is not a chatbot. It is not a dashboard. It is not a one-time startup generator.</p>
                        <p>Founding AI behaves like a small leadership team — strategy, finance, operations, and execution — working together on your business.</p>
                        <div className="lp-highlight-box">
                            Think: AI Chief-of-Staff for founders.
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section id="how-it-works" className="lp-section lp-how-it-works reveal-on-scroll">
                <div className="lp-container">
                    <div className="lp-steps-grid">
                        <div className="lp-step">
                            <span className="lp-step-num">01</span>
                            <h4>You issue a command</h4>
                            <p>"Open a bakery" or "Revenue dropped this week"</p>
                        </div>
                        <div className="lp-connector"></div>
                        <div className="lp-step">
                            <span className="lp-step-num">02</span>
                            <h4>AI Agents Collaborate</h4>
                            <p>Strategy, Ops, Finance, Tech — each with a specific role.</p>
                        </div>
                        <div className="lp-connector"></div>
                        <div className="lp-step">
                            <span className="lp-step-num">03</span>
                            <h4>Agents Debate & Revise</h4>
                            <p>Conflicts are resolved before decisions are made.</p>
                        </div>
                        <div className="lp-connector"></div>
                        <div className="lp-step">
                            <span className="lp-step-num">04</span>
                            <h4>Clear Outcomes</h4>
                            <p>A plan, priorities, or a final decision.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CAPABILITIES */}
            <section className="lp-section lp-capabilities reveal-on-scroll">
                <div className="lp-container">
                    <h2 className="lp-section-header">Core Capabilities</h2>
                    <div className="lp-cards-grid">
                        <div className="lp-card">
                            <Zap className="lp-card-icon" />
                            <h3>Launch a Business</h3>
                            <ul>
                                <li>Strategy, operations, finance</li>
                                <li>Full business blueprint</li>
                                <li>Website generation</li>
                            </ul>
                        </div>
                        <div className="lp-card">
                            <Activity className="lp-card-icon" />
                            <h3>Run Daily</h3>
                            <ul>
                                <li>Daily priorities</li>
                                <li>Weekly planning</li>
                                <li>Decision support</li>
                            </ul>
                        </div>
                        <div className="lp-card">
                            <Layers className="lp-card-icon" />
                            <h3>Agentic Decisions</h3>
                            <ul>
                                <li>Multiple AI agents</li>
                                <li>Built-in debate</li>
                                <li>Financial veto & realism</li>
                            </ul>
                        </div>
                        <div className="lp-card">
                            <Database className="lp-card-icon" />
                            <h3>Persistent Memory</h3>
                            <ul>
                                <li>Business state remembered</li>
                                <li>Context carries forward</li>
                                <li>Real execution outputs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. DIFFERENTIATION */}
            <section className="lp-section lp-diff reveal-on-scroll">
                <div className="lp-container lp-grid-2-diff">
                    <div className="lp-diff-col text-right opacity-50">
                        <h4>Traditional AI</h4>
                        <ul>
                            <li>Single response</li>
                            <li>No memory</li>
                            <li>No responsibility</li>
                            <li>No debate</li>
                        </ul>
                    </div>
                    <div className="lp-diff-divider"></div>
                    <div className="lp-diff-col text-left text-primary">
                        <h4>Founding AI</h4>
                        <ul>
                            <li>Multi-agent system</li>
                            <li>Persistent state</li>
                            <li>Conflict resolution</li>
                            <li>Final accountability</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 7. WHO IT'S FOR */}
            <section className="lp-section lp-personas reveal-on-scroll">
                <div className="lp-container centered">
                    <h2 className="lp-section-header">Built for people running real businesses.</h2>
                    <div className="lp-persona-tags">
                        <span>Startup Founders</span>
                        <span>SMB Owners</span>
                        <span>Solo Founders</span>
                        <span>Operators</span>
                    </div>
                    <p className="lp-personas-close">If you make decisions every day, Founding AI is built for you.</p>
                </div>
            </section>

            {/* 8. FINAL CTA */}
            <section className="lp-section lp-final-cta reveal-on-scroll">
                <div className="lp-container centered">
                    <h2 className="lp-headline-small">Stop managing tools. Start running your business.</h2>
                    <button className="lp-btn-primary lp-btn-large" onClick={onStart}>
                        Run Founding AI
                    </button>
                    <p className="lp-subtext">One command. A full AI team.</p>
                </div>
            </section>

            <footer className="lp-footer">
                <div className="lp-container footer-content">
                    <div className="footer-logo">Founding AI</div>
                    <div className="footer-links">
                        <a href="#">About</a>
                        <a href="#">Docs</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
