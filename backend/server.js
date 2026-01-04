import express from 'express';
import cors from 'cors';
import { Orchestrator } from './src/core/Orchestrator.js';
import { CONFIG } from './src/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
// Serve generated sites statically
app.use('/sites', express.static(path.join(__dirname, 'public/sites')));

let clients = [];
let orchestrator = new Orchestrator(CONFIG.GEMINI_API_KEY);
let lastCommand = ""; // Store the last user command for context retention during clarification

// Basic in-memory history to fix race conditions (client connecting after start)
let eventHistory = [];

const broadcast = (data) => {
    // Add to history (keep last 100)
    eventHistory.push(data);
    if (eventHistory.length > 100) eventHistory.shift();

    clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
};

app.get('/stream', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    console.log(`Client connected to event stream. ID: ${clientId}`);
    clients.push(newClient);

    // Send connection confirmation
    res.write(`data: ${JSON.stringify({ type: 'timeline_event', data: { agent: 'System', action: 'Connected to AI Brain', status: 'accepted' } })}\n\n`);

    // Replay history
    if (eventHistory.length > 0) {
        console.log(`Replaying ${eventHistory.length} events to client ${clientId}`);
        eventHistory.forEach(event => {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        });
    }

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
});

app.post('/start', async (req, res) => {
    const { command, role, images } = req.body;
    if (!command) return res.status(400).send('Command is required');

    console.log('Received command:', command, 'Role:', role, 'Images:', images ? images.length : 0);

    // Clear history for a fresh run
    eventHistory = [];
    lastCommand = command; // Store for clarification context

    // Combine command with role and images for context if present
    const executionContext = {};
    if (role) executionContext.role = role;
    if (images) executionContext.images = images;

    // Start the orchestrator asynchronously to not block the response
    // We use the broadcast function as the callback
    orchestrator.run(command, (event) => {
        broadcast(event);
    }, executionContext).catch(err => {
        console.error("Orchestrator error:", err);
        broadcast({ type: 'error', data: err.message });
    });

    res.json({ status: 'started' });
});

app.post('/reply', async (req, res) => {
    const { answer } = req.body;
    if (!answer) return res.status(400).send('Answer is required');

    console.log('Received clarification answer:', answer);

    if (!lastCommand) {
        return res.status(400).send('No active session found. Please restart.');
    }

    const newCommand = `${lastCommand}. Additional Context: ${answer}`;
    console.log('Resuming with combined command:', newCommand);
    lastCommand = newCommand; // Update for potential further clarifications

    // Clear history for the "resume" phase? Or keep it?
    // Let's keep it so user sees the history + new actions. 
    // Actually, orchestrator resets memory, so it will re-emit events.
    // We should probably explicitly mark a "Resume" in the stream.
    broadcast({ type: 'timeline_event', data: { agent: 'User', action: `Replied: ${answer}`, status: 'accepted' } });
    broadcast({ type: 'timeline_event', data: { agent: 'System', action: 'Resuming simulation with new context...', status: 'pending' } });

    orchestrator.run(newCommand, (event) => {
        broadcast(event);
    }).catch(err => {
        console.error("Orchestrator error:", err);
        broadcast({ type: 'error', data: err.message });
    });

    res.json({ status: 'resumed' });
});

// Start Server (Conditional for Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

export default app;
