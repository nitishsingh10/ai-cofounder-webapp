import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATE_FILE_PATH = path.join(__dirname, '../../business_state.json');

const INITIAL_STATE = {
    business_profile: {}, // Name, industry, description
    metrics: {}, // Revenue, burn rate, users, etc.
    priorities: [], // Current focus areas
    active_issues: [], // Problems needing solving
    ongoing_projects: [], // Active work features
    recent_decisions: [], // Log of past AI decisions
    last_updated: ""
};

class BusinessState {
    constructor() {
        this.state = null;
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(STATE_FILE_PATH)) {
                const raw = fs.readFileSync(STATE_FILE_PATH, 'utf8');
                this.state = JSON.parse(raw);
            } else {
                this.state = { ...INITIAL_STATE };
                this.save();
            }
        } catch (e) {
            console.error("Failed to load business state:", e);
            this.state = { ...INITIAL_STATE };
        }
        return this.state;
    }

    save() {
        try {
            this.state.last_updated = new Date().toISOString();
            fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(this.state, null, 2));
        } catch (e) {
            console.error("Failed to save business state:", e);
        }
    }

    get() {
        if (!this.state) this.load();
        return this.state;
    }

    update(updates) {
        if (!this.state) this.load();
        this.state = { ...this.state, ...updates };
        this.save();
        return this.state;
    }

    // specific helpers
    updateMetrics(newMetrics) {
        return this.update({ metrics: { ...this.state.metrics, ...newMetrics } });
    }

    addDecision(decision) {
        const decisions = [decision, ...this.state.recent_decisions].slice(0, 50); // Keep last 50
        return this.update({ recent_decisions: decisions });
    }
}

export default new BusinessState();
