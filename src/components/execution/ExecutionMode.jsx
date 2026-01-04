import { useState, useEffect } from 'react';
import Timeline from './Timeline';
import ArtifactCanvas from './ArtifactCanvas';
import AgentContentions from './AgentContentions';
import { API_BASE_URL } from '../../config';

import './ExecutionMode.css';

const ExecutionMode = ({ onComplete }) => {
    const [events, setEvents] = useState([]);
    const [artifacts, setArtifacts] = useState({});
    const [contentions, setContentions] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [clarification, setClarification] = useState(null);
    const [answer, setAnswer] = useState("");

    const handleReply = async () => {
        if (!answer.trim()) return;

        try {
            await fetch(`${API_BASE_URL}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer })
            });
            setClarification(null);
            setAnswer("");
        } catch (e) {
            console.error("Failed to send reply", e);
            alert("Failed to send reply. Check console.");
        }
    };

    useEffect(() => {
        console.log(`Attempting to connect to EventSource at ${API_BASE_URL}/stream`);
        const eventSource = new EventSource(`${API_BASE_URL}/stream`);

        eventSource.onopen = () => {
            console.log("EventSource connected!");
        };

        eventSource.onmessage = (event) => {
            console.log("Received raw event:", event.data);
            const parsedData = JSON.parse(event.data);
            const { type, data } = parsedData;

            if (type === 'timeline_event') {
                setEvents(prev => [...prev, data]);
            } else if (type === 'artifact_update') {
                setArtifacts(prev => ({
                    ...prev,
                    [data.id]: data
                }));
            } else if (type === 'contention') {
                // Update specific contention by ID or add new
                setContentions(prev => {
                    const idx = prev.findIndex(c => c.id === data.id);
                    if (idx >= 0) {
                        const newArr = [...prev];
                        newArr[idx] = data; // replace with latest status
                        return newArr;
                    } else {
                        return [...prev, data];
                    }
                });
            } else if (type === 'completion') {
                setIsComplete(true);
                if (onComplete) onComplete(data);
            } else if (type === 'error') {
                setEvents(prev => [...prev, {
                    agent: 'System',
                    action: `ERROR: ${data}`,
                    status: 'revised'
                }]);
            } else if (type === 'clarification') {
                // Determine question from data object or direct property
                const questionText = data.question || "Clarification needed...";
                setClarification({ question: questionText });

                setEvents(prev => [...prev, {
                    agent: 'System',
                    action: `Waiting for user input: ${questionText}`,
                    status: 'pending' // pending until answered
                }]);
            }
        };

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="execution-mode">
            <div className="pane-left">
                <Timeline events={events} />
                <AgentContentions contentions={contentions} />
            </div>
            <div className="pane-right">
                <ArtifactCanvas artifacts={artifacts} />
            </div>

            {/* Clarification Modal */}
            {clarification && (
                <div className="modal-overlay">
                    <div className="modal-content clarification-modal">
                        <h3>Clarification Needed</h3>
                        <p>{clarification.question}</p>
                        <div className="input-group">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                            />
                            <button onClick={handleReply} className="btn-primary">Submit Answer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutionMode;
