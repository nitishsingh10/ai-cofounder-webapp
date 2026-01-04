import { Terminal, Users, FileText } from 'lucide-react';
import './IntelligenceFlow.css';

export default function IntelligenceFlow() {
    const steps = [
        { icon: Terminal, label: "Issue a command" },
        { icon: Users, label: "AI agents collaborate" },
        { icon: FileText, label: "Receive blueprint" }
    ];

    return (
        <section className="intelligence-flow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flow-container">
                {steps.map((step, index) => (
                    <div key={index} className="flow-step">
                        <div className="icon-wrapper">
                            <step.icon size={24} strokeWidth={1.5} />
                        </div>
                        <span className="step-label">{step.label}</span>
                        {index < steps.length - 1 && <div className="flow-line" />}
                    </div>
                ))}
            </div>
        </section>
    );
}
