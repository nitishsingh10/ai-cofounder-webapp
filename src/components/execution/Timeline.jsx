import { Check, AlertTriangle, Play } from 'lucide-react';
import './Timeline.css';

export default function Timeline({ events }) {
    return (
        <div className="timeline-container">
            <h3 className="section-title">Intelligence Timeline</h3>
            <div className="timeline-events">
                {events.map((event, index) => {
                    if (event.type === 'contention' || event.statementA) {
                        // Render Contention Card
                        return (
                            <div key={index} className={`contention-card animate-fade-in ${event.status}`} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="contention-header">
                                    <div className="contention-icon">
                                        {event.status === 'resolved' ? <Check size={16} /> : <AlertTriangle size={16} />}
                                    </div>
                                    <div className="contention-meta">
                                        <div className="contention-title">{event.title}</div>
                                        <div className="contention-agents">{event.agents.join(' vs ')}</div>
                                    </div>
                                </div>
                                <div className="contention-body">
                                    <div className="contention-statement"><strong>{event.agents[0]}:</strong> {event.statementA}</div>
                                    <div className="contention-statement"><strong>{event.agents[1]}:</strong> {event.statementB}</div>
                                    <div className="contention-outcome">{event.outcome}</div>
                                </div>
                            </div>
                        );
                    }

                    // Standard Timeline Event
                    return (
                        <div key={index} className="timeline-event animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="event-time-connector">
                                <div className="event-dot" />
                                {index < events.length - 1 && <div className="event-line" />}
                            </div>
                            <div className="event-content">
                                <div className="agent-name">{event.agent}</div>
                                <div className="action-summary">{event.action}</div>
                                {event.status === 'accepted' && (
                                    <div className="status-indicator status-accepted">
                                        <Check size={12} /> Accepted
                                    </div>
                                )}
                                {event.status === 'revised' && (
                                    <div className="status-indicator status-revised">
                                        <AlertTriangle size={12} /> Revised
                                    </div>
                                )}
                                {event.status === 'pending' && (
                                    <div className="loading-container">
                                        <span className="status-text">Thinking...</span>
                                        <div className="loading-bar">
                                            <div className="loading-bar-fill" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
