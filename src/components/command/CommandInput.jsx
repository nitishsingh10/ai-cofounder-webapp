import { ArrowRight, Zap, Target, Activity, Layers } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Send, Command, Loader2, Play, Briefcase, Layout, TrendingUp, Cpu, Upload, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import './CommandInput.css';

const PLACEHOLDERS = [
    "Open a bakery in Bellandur with a ₹3 lakh budget",
    "Revenue dropped this week — what should I focus on?",
    "Plan my priorities for today",
    "Help me decide whether to hire or wait"
];

const ROLES = [
    "Startup Founder / Operator",
    "Small Business Owner (Shop, Café, Local Business)",
    "Aspiring Founder (Planning to Start)",
    "Freelancer / Solo Operator",
    "Just exploring"
];

export default function CommandInput({ onExecute }) {
    const [command, setCommand] = useState('');
    const [selectedRole, setSelectedRole] = useState(ROLES[0]);
    const [images, setImages] = useState([]); // Base64 strings
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [fadePlaceholder, setFadePlaceholder] = useState(true);

    // Rotate placeholders
    useEffect(() => {
        const interval = setInterval(() => {
            setFadePlaceholder(false); // Start fade out
            setTimeout(() => {
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
                setFadePlaceholder(true); // Fade in new
            }, 500); // 500ms fade out duration matches CSS
        }, 4000); // Change every 4s

        return () => clearInterval(interval);
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Limit to 5
        const validFiles = files.slice(0, 5);

        Promise.all(validFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })).then(base64Images => {
            setImages(prev => [...prev, ...base64Images].slice(0, 5));
        }).catch(err => console.error("Image upload failed", err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!command.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command,
                    role: selectedRole,
                    images: images
                })
            });
            onExecute(command);
        } catch (error) {
            console.error("Failed to start simulation:", error);
            alert("Failed to connect to the AI Backend. Please ensure the backend server is running on port 3000.\n\nError: " + error.message);
        }
    };

    const showRenovation = selectedRole.includes("Small Business Owner");

    return (
        <div className="command-wrapper animate-slow-fade-in">
            <div className="command-container">

                <div className="command-header">
                    <span className="execution-label">EXECUTION MODE</span>
                    <h1 className="command-headline">Issue a command to your<br />AI founding team</h1>
                    <p className="command-subheadline">
                        One instruction. A team of AI agents will plan, debate, and execute.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="command-form">
                    <div className="input-group">
                        <textarea
                            className="command-input"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            autoFocus
                            rows={2}
                        />
                        {/* Placeholder Overlay to handle fade animation cleanly */}
                        {!command && (
                            <div className={`placeholder-overlay ${fadePlaceholder ? 'visible' : 'hidden'}`}>
                                {PLACEHOLDERS[placeholderIndex]}
                            </div>
                        )}
                    </div>

                    <div className="role-selector-group">
                        <label className="role-label">Who is this for?</label>
                        <div className="role-select-wrapper">
                            <select
                                className="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                {ROLES.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {showRenovation && (
                        <div className="renovation-upload-section fade-in">
                            <h3 className="renovation-title">Optional: Improve your existing shop</h3>
                            <p className="renovation-helper">Upload photos of your current shop to explore renovation ideas and cost estimates.</p>

                            <div className="upload-box">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg"
                                    onChange={handleImageUpload}
                                    className="file-input-hidden"
                                    id="shop-upload"
                                />
                                <label htmlFor="shop-upload" className="upload-label">
                                    <div className="upload-content">
                                        <span className="upload-icon">+</span>
                                        <span className="upload-text">Upload shop photos (optional)</span>
                                        <span className="upload-hint">JPG or PNG · Front, interior, or counter area ({images.length}/5)</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="capabilities-row">
                        <div className="cap-item"><Zap size={14} /> Launch a business</div>
                        <div className="cap-item"><Activity size={14} /> Run daily operations</div>
                        <div className="cap-item"><Target size={14} /> Resolve decisions</div>
                        <div className="cap-item"><Layers size={14} /> Build real assets</div>
                    </div>

                    <div className="command-actions">
                        <button type="submit" className="btn-run-team" disabled={!command.trim()}>
                            Run AI Team <ArrowRight size={18} />
                        </button>
                    </div>
                </form>

                <div className="command-footer">
                    Not a chatbot. A multi-agent decision system.
                </div>

            </div>
        </div>
    );
}
