import { ChevronDown, ChevronUp } from 'lucide-react';
import './ArtifactCanvas.css';
import './ArtifactStyles.css';

import { useState, useEffect } from 'react';
import './ArtifactCanvas.css';

const ArtifactCanvas = ({ artifacts }) => {
    const [activeTab, setActiveTab] = useState(null);
    const artifactList = Object.values(artifacts);

    // Auto-select the newest artifact if none selected, or if new one appears?
    // Let's just select the first one if nothing is active.
    useEffect(() => {
        if (!activeTab && artifactList.length > 0) {
            setActiveTab(artifactList[0].id);
        }
    }, [artifactList.length, activeTab]);

    // Helper to render JSON content nicely (Recursive)
    const renderArtifactContent = (content) => {
        try {
            // Robust parsing logic
            let data;
            let safeContent = content;

            // 1. Sanitize helper (fix bad control characters)
            const sanitize = (str) => {
                if (typeof str !== 'string') return str;
                // Replace unescaped newlines/tabs that break JSON
                return str
                    .replace(/[\n\r]/g, '\\n')
                    .replace(/[\t]/g, '\\t');
            };

            // 2. Parse Attempt 1 (Direct)
            try {
                data = typeof content === 'string' ? JSON.parse(content) : content;
            } catch (e1) {
                // 3. Parse Attempt 2 (Sanitized)
                try {
                    if (typeof content === 'string') {
                        safeContent = sanitize(content);
                        data = JSON.parse(safeContent);
                    } else {
                        throw e1;
                    }
                } catch (e2) {
                    // 4. Parse Attempt 3 (Aggressive/Loose or just fail)
                    // If it fails, it might be raw text intended to be raw.
                    throw e1;
                }
            }

            // 5. Handle Double-Encoded JSON (String inside String)
            if (typeof data === 'string') {
                try {
                    const nested = JSON.parse(data);
                    if (typeof nested === 'object' && nested !== null) {
                        data = nested;
                    }
                } catch (ignore) { }
            }

            if (typeof data !== 'object' || data === null) {
                return <p className="artifact-value">{String(data)}</p>;
            }

            // Check against activeArtifact.id, not 'artifact.id' which is undefined
            if (activeArtifact && activeArtifact.id === 'renovation') {
                return (
                    <div className="artifact-renovation">
                        <div className="renovation-header">
                            <h3>Visual Analysis</h3>
                            <p>{data.visual_analysis}</p>
                        </div>

                        <div className="renovation-style">
                            <h4>Proposed Style</h4>
                            <p className="style-tag">{data.renovation_style}</p>
                        </div>

                        <div className="renovation-upgrades">
                            <h4>Upgrade Plan & Cost Estimates</h4>
                            <table className="cost-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Description</th>
                                        <th>Est. Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.upgrades && data.upgrades.map((u, i) => (
                                        <tr key={i}>
                                            <td>{u.item}</td>
                                            <td>{u.description}</td>
                                            <td>{u.estimated_cost}</td>
                                        </tr>
                                    ))}
                                    <tr className="total-row">
                                        <td colSpan="2">Total Estimated Cost</td>
                                        <td>{data.total_estimated_cost}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="renovation-visuals">
                            <h4>Renovated Visual Visualization</h4>
                            <div className="visual-placeholder">
                                <div className="visual-hint">
                                    "Nano Banana" Generation:
                                </div>
                                <p className="visual-prompt">{data.renovation_image_prompt}</p>
                                {/* Placeholder for the demo - normally we'd show the generated image here */}
                                <div className="visual-mock">
                                    [ AI Generated Renovation Preview Would Appear Here ]
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            if (activeArtifact.id === 'design') {
                return (
                    <div className="artifact-design">
                        {data.logo_svg && (
                            <div className="design-hero-logo">
                                <span className="label">Generated Identity</span>
                                <div className="logo-preview-box" dangerouslySetInnerHTML={{ __html: data.logo_svg }} />
                            </div>
                        )}
                        <div className="artifact-structured">
                            {Object.entries(data).map(([key, value]) => {
                                if (key === 'logo_svg') return null; // Skip duplicate rendering
                                return (
                                    <div key={key} className="artifact-section">
                                        <h4 className="artifact-key">{key.replace(/_/g, ' ')}</h4>
                                        {renderRecursiveValue(value, key)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            if (activeArtifact.id === 'tech') {
                return (
                    <div className="artifact-tech">
                        {(data.preview_url || data.file_structure) ? (
                            <div className="tech-launch-pad">
                                <div className="launch-header">
                                    <h3>🚀 Application Ready</h3>
                                    <p>Your technical foundation is ready. {data.preview_url ? "Deployed to staging." : "Generated locally."}</p>
                                </div>
                                <div className="launch-actions">
                                    {/* Use server URL if available, else generate blob URL on click or effect */}
                                    <button
                                        onClick={() => {
                                            const url = data.preview_url || (() => {
                                                try {
                                                    const findFile = (obj, name) => {
                                                        if (obj[name]) return obj[name];
                                                        for (const key in obj) {
                                                            if (typeof obj[key] === 'object') {
                                                                const found = findFile(obj[key], name);
                                                                if (found) return found;
                                                            }
                                                        }
                                                        return null;
                                                    };
                                                    const html = findFile(data.file_structure, 'index.html') || "<h1>No Index Found</h1>";
                                                    // Basic style injection if found
                                                    let finalHtml = html;
                                                    const css = findFile(data.file_structure, 'styles.css') || findFile(data.file_structure, 'style.css') || findFile(data.file_structure, 'App.css');
                                                    if (css) {
                                                        finalHtml = html.replace('</head>', `<style>${css}</style></head>`);
                                                    }
                                                    const blob = new Blob([finalHtml], { type: 'text/html' });
                                                    return URL.createObjectURL(blob);
                                                } catch (e) { return '#'; }
                                            })();
                                            window.open(url, '_blank');
                                        }}
                                        className="btn-launch primary">
                                        View Live Site
                                    </button>

                                    <a href={data.preview_url || "#"} onClick={(e) => {
                                        if (!data.preview_url && data.file_structure) {
                                            e.preventDefault();
                                            alert("Download unavailable in preview mode. Copy code from below.");
                                        }
                                    }} download="source-code.zip" className="btn-launch secondary">
                                        {data.preview_url ? "Download Source (.zip)" : "Source Code Below"}
                                    </a>
                                </div>
                            </div>
                        ) : null}
                        <div className="artifact-structured">
                            {Object.entries(data).map(([key, value]) => (
                                <div key={key} className="artifact-section">
                                    <h4 className="artifact-key">{key.replace(/_/g, ' ')}</h4>
                                    {renderRecursiveValue(value, key)}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            return (
                <div className="artifact-structured">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="artifact-section">
                            <h4 className="artifact-key">{key.replace(/_/g, ' ')}</h4>
                            {renderRecursiveValue(value, key)}
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            return <pre className="artifact-raw">{content}</pre>;
        }
    };

    const renderRecursiveValue = (value, keyName = '') => {
        if (Array.isArray(value)) {
            return (
                <ul className="artifact-list">
                    {value.map((item, i) => (
                        <li key={i}>{renderRecursiveValue(item)}</li>
                    ))}
                </ul>
            );
        } else if (typeof value === 'object' && value !== null) {
            return (
                <div className="artifact-nested-obj">
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey} className="artifact-nested-row">
                            <span className="artifact-nested-key">{subKey.replace(/_/g, ' ')}:</span>
                            <span className="artifact-nested-val"> {renderRecursiveValue(subValue, subKey)}</span>
                        </div>
                    ))}
                </div>
            );
        } else {
            // Check if key is preview_url or value looks like a URL
            if (keyName === 'preview_url' || (typeof value === 'string' && value.startsWith('http'))) {
                return <a href={value} target="_blank" rel="noopener noreferrer" className="artifact-link">{String(value)}</a>;
            }
            // Check if key is logo_svg
            if (keyName === 'logo_svg') {
                return (
                    <div className="artifact-logo-preview" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginTop: '0.5rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: value }} />
                    </div>
                );
            }

            return <span>{String(value)}</span>;
        }
    };

    const activeArtifact = artifactList.find(a => a.id === activeTab);

    return (
        <div className="artifact-canvas">
            <div className="artifact-header-row">
                <h3 className="section-title">Live Business Blueprint</h3>
                <div className="live-indicator">
                    <div className="live-dot" /> Live Updating
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="artifact-tabs">
                {artifactList.map((artifact) => (
                    <button
                        key={artifact.id}
                        className={`artifact-tab ${activeTab === artifact.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(artifact.id)}
                    >
                        {artifact.title}
                        {artifact.version > 1 && <span className="tab-version">v{artifact.version}</span>}
                    </button>
                ))}
            </div>

            {/* Active Content Area */}
            <div className="artifact-content-area">
                {activeArtifact ? (
                    <div className="artifact-card animate-scale-in">
                        <div className="artifact-card-header">
                            <span className="artifact-type">{activeArtifact.id}</span>
                            <span className="updated-badge">Updated Just Now</span>
                        </div>
                        <div className="artifact-body">
                            {renderArtifactContent(activeArtifact.content)}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Waiting for agents to generate intelligence...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtifactCanvas;
