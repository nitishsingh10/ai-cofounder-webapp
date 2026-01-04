import { useState, useEffect } from 'react';

const ContentionCard = ({ title, agents, status, statementA, statementB, outcome }) => {
    const [expanded, setExpanded] = useState(false);

    const isResolved = status === 'resolved';

    return (
        <div
            className={`contention-card ${isResolved ? 'resolved' : 'open'}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="contention-header">
                <div className="contention-icon">
                    {isResolved ? '✔' : '⚠'}
                </div>
                <div className="contention-meta">
                    <span className="contention-title">{title}</span>
                    <span className="contention-agents">{agents.join(' × ')}</span>
                </div>
                <div className="contention-chevron">
                    {expanded ? '▼' : '▶'}
                </div>
            </div>

            {expanded && (
                <div className="contention-body animate-fade-in">
                    <div className="contention-statement">
                        <strong>{agents[0]}:</strong> "{statementA}"
                    </div>
                    {statementB && (
                        <div className="contention-statement">
                            <strong>{agents[1] || 'Agent B'}:</strong> "{statementB}"
                        </div>
                    )}
                    <div className="contention-outcome">
                        {outcome}
                    </div>
                </div>
            )}
        </div>
    );
};

const AgentContentions = ({ contentions }) => {
    if (!contentions || contentions.length === 0) return null;

    return (
        <div className="agent-contentions-container">
            <h4 className="section-title">AGENT CONTENTIONS</h4>
            {contentions.map((c, i) => (
                <ContentionCard key={i} {...c} />
            ))}
        </div>
    );
};

export default AgentContentions;
