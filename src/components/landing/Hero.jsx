import { ArrowRight, Play } from 'lucide-react';
import './Hero.css';

export default function Hero({ onStart }) {
    return (
        <section className="hero animate-fade-in">
            <div className="hero-content">
                <div className="product-label">Founding AI</div>
                <h1 className="headline">
                    Build a company with a <br />
                    team of AI founders.
                </h1>
                <p className="subheadline">
                    Give one command. Our AI agents plan, validate, <br />
                    and assemble the business.
                </p>

                <div className="cta-group">
                    <button className="btn-primary" onClick={onStart}>
                        Run the AI Team
                        <ArrowRight size={18} className="icon-right" />
                    </button>
                    <button className="btn-secondary">
                        See how it works
                    </button>
                </div>
            </div>
        </section>
    );
}
