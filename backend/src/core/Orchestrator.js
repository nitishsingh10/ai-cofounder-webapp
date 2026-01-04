import { Memory } from './Memory.js';
import { IntentAnalyzer } from '../agents/IntentAnalyzer.js';
import { PlannerAgent } from '../agents/PlannerAgent.js';
import { StrategyAgent } from '../agents/StrategyAgent.js';
import { OperationsAgent } from '../agents/OperationsAgent.js';
import { FinanceAgent } from '../agents/FinanceAgent.js';
import { DesignAgent } from '../agents/DesignAgent.js';
import { MarketingAgent } from '../agents/MarketingAgent.js';
import { TechAgent } from '../agents/TechAgent.js';
import { SynthesisAgent } from '../agents/SynthesisAgent.js';
import { RenovationAgent } from '../agents/RenovationAgent.js';
import { DailyPlannerAgent, OpsIntelligenceAgent, FinanceIntelligenceAgent, DecisionAdvisorAgent } from '../agents/DailyAgents.js';
import { Agent } from './Agent.js';
import businessState from './BusinessState.js';

import fs from 'fs';
import path from 'path';

export class Orchestrator {
    constructor(apiKey) {
        this.memory = new Memory();
        this.publicDir = path.join(process.cwd(), 'public', 'sites');
        if (!fs.existsSync(this.publicDir)) {
            fs.mkdirSync(this.publicDir, { recursive: true });
        }

        // Initialize Agents
        this.agents = {
            intent: new IntentAnalyzer(),
            planner: new PlannerAgent(),
            strategy: new StrategyAgent(),
            ops: new OperationsAgent(),
            finance: new FinanceAgent(),
            design: new DesignAgent(),
            marketing: new MarketingAgent(),
            tech: new TechAgent(),
            synthesis: new SynthesisAgent(),
            renovation: new RenovationAgent(),

            // Operate Mode Agents
            daily_planner: new DailyPlannerAgent(),
            ops_intel: new OpsIntelligenceAgent(),
            finance_intel: new FinanceIntelligenceAgent(),
            decision_advisor: new DecisionAdvisorAgent()
        };

        // Initialize AI models
        Object.values(this.agents).forEach(agent => agent.initialize(apiKey));
    }

    async run(command, onEvent = () => { }, executionContext = {}) {
        const emit = (type, data) => {
            onEvent({ type, data });
        };

        try {
            console.log("🚀 Starting Founding AI Simulation...", executionContext);
            this.memory = new Memory(); // Reset memory for each run

            // Inject role/context into command string or memory explicitly
            let activeCommand = command;
            if (executionContext.role) {
                activeCommand = `[Role: ${executionContext.role}] ${command}`;
            }

            // Store images in memory if present
            if (executionContext.images && executionContext.images.length > 0) {
                this.memory.setImages(executionContext.images);
                console.log("📸 Images stored in memory for analysis.");
            }

            this.memory.init(activeCommand);

            // 1. Analyze Intent
            emit('timeline_event', { agent: 'Intent Analyzer Agent', action: 'Thinking...', status: 'pending' });

            // Sanitize state for text-based agents (remove heavy images)
            const getSanitizedState = () => {
                const state = this.memory.getSnapshot();
                const { images, ...sanitized } = state;
                return sanitized;
            };

            const intent = await this.agents.intent.run(getSanitizedState());
            this.memory.updateConstraints({ ...intent.constraints });

            console.log(`[Orchestrator] Mode: ${intent.mode}, Agents: ${intent.required_agents.join(', ')}`);
            emit('timeline_event', { agent: 'Intent Analyzer Agent', action: `Analyzed Intent: ${intent.mode}`, status: 'accepted' });

            if (intent.clarification_question) {
                emit('clarification', { question: intent.clarification_question });
                return { status: "clarification_needed", question: intent.clarification_question };
            }

            const runAgent = async (id, name, action) => {
                if (!intent.required_agents.includes(id) && !intent.required_agents.includes('all')) return null;

                console.log(`\n▶️ Running ${name}...`);
                emit('timeline_event', { agent: name, action: action, status: 'pending' });

                // Use sanitized state for all standard agents
                const result = await this.agents[id].run(getSanitizedState());
                emit('timeline_event', { agent: name, action: 'Task Complete', status: 'accepted' });

                return result;
            };

            const activeAgents = intent.required_agents;

            // Helper to check if an agent is active (explicitly or via 'all')
            const hasAgent = (id) => activeAgents.includes(id) || activeAgents.includes('all');

            // 2. Planning
            if (hasAgent('planner')) {
                console.log("\n📋 Generating Execution Plan...");
                emit('timeline_event', { agent: 'Orchestrator Agent', action: 'Generating Execution Plan...', status: 'pending' });
                const plan = await this.agents.planner.run(getSanitizedState());
                this.memory.setPlan(plan.execution_plan);
                emit('timeline_event', { agent: 'Orchestrator Agent', action: 'Plan Generated', status: 'accepted' });
            }

            if (hasAgent('daily_planner')) {
                const daily = await runAgent('daily_planner', 'Daily Planner', 'Analyzing Today\'s Priorities');
                if (daily) {
                    emit('artifact_update', { id: 'daily_briefing', title: 'Daily Briefing', content: JSON.stringify(daily.daily_briefing, null, 2), version: 1, isOpen: true });
                }
            }

            if (hasAgent('ops_intel')) {
                const report = await runAgent('ops_intel', 'Ops Intelligence', 'Monitoring System Health');
                if (report) {
                    emit('artifact_update', { id: 'ops_report', title: 'Ops Intelligence Report', content: JSON.stringify(report.ops_report, null, 2), version: 1, isOpen: true });
                }
            }

            if (hasAgent('finance_intel')) {
                const review = await runAgent('finance_intel', 'Finance Intelligence', 'Reviewing Financial Health');
                if (review) {
                    emit('artifact_update', { id: 'finance_review', title: 'Financial Review', content: JSON.stringify(review.financial_review, null, 2), version: 1, isOpen: true });
                }
            }

            if (hasAgent('decision_advisor')) {
                const decision = await runAgent('decision_advisor', 'Decision Advisor', 'Synthesizing Decision');
                if (decision) {
                    emit('artifact_update', { id: 'decision_memo', title: 'Decision Memo', content: JSON.stringify(decision.decision_memo, null, 2), version: 1, isOpen: true });
                }
            }


            // 3. Main Debate Loop (Strategy + Ops vs Finance)
            const isDebateMode = hasAgent('strategy') && hasAgent('ops') && hasAgent('finance');

            if (isDebateMode) {
                let approved = false;
                let revisions = 0;
                const MAX_REVISIONS = 2; // Keep it short for demo

                while (!approved && revisions < MAX_REVISIONS) {
                    console.log(`\n🔄 Debate Iteration ${revisions + 1}`);

                    // Strategy
                    emit('timeline_event', { agent: 'Strategy Agent', action: 'Defining Business Strategy', status: 'pending' });
                    const strategy = await this.agents.strategy.run(this.memory.getSnapshot());
                    this.memory.saveArtifact("StrategyAgent", "strategy", strategy.strategy);
                    emit('artifact_update', { id: 'concept', title: 'Business Strategy', content: JSON.stringify(strategy.strategy, null, 2), version: revisions + 1, isOpen: true });
                    emit('timeline_event', { agent: 'Strategy Agent', action: 'Strategy Drafted', status: 'accepted' });

                    // Ops
                    emit('timeline_event', { agent: 'Operations Agent', action: 'Planning Operations', status: 'pending' });
                    const ops = await this.agents.ops.run(this.memory.getSnapshot());
                    this.memory.saveArtifact("OperationsAgent", "operations", ops.operations);
                    emit('artifact_update', { id: 'ops', title: 'Operations Plan', content: JSON.stringify(ops.operations, null, 2), version: revisions + 1, isOpen: true });
                    emit('timeline_event', { agent: 'Operations Agent', action: 'Operations Planned', status: 'accepted' });

                    // Finance (The Judge)
                    console.log("💰 Running Finance Check...");
                    emit('timeline_event', { agent: 'Finance Agent', action: 'Validating Financial Viability', status: 'pending' });
                    const finance = await this.agents.finance.run(this.memory.getSnapshot());
                    this.memory.saveArtifact("FinanceAgent", "financials", finance.financials);
                    emit('artifact_update', { id: 'finance', title: 'Financial Model', content: JSON.stringify(finance.financials, null, 2), version: revisions + 1, isOpen: true });

                    if (finance.decision === "PASS") {
                        console.log("✅ Finance Approved!");
                        emit('contention', {
                            id: 'budget-viability',
                            title: 'Financial Viability',
                            agents: ['Finance', 'Strategy'],
                            status: 'resolved',
                            statementA: finance.revision_request ? "Revised plan meets margin targets." : "Plan is financially sound.",
                            statementB: "Strategy optimized for efficiency.",
                            outcome: "✔ Budget & Strategy Aligned"
                        });
                        emit('timeline_event', { agent: 'Finance Agent', action: 'Budget Approved', status: 'accepted' });
                        approved = true;
                    } else {
                        console.log("❌ Finance Rejected!");
                        const issue = finance.revision_request ? finance.revision_request.issue : "Financials not viable.";
                        const suggestion = finance.revision_request ? finance.revision_request.suggestion : "Reduce costs.";
                        emit('contention', {
                            id: 'budget-viability',
                            title: 'Financial Viability Conflict',
                            agents: ['Finance', 'Strategy'],
                            status: 'open',
                            statementA: issue,
                            statementB: "Strategy focuses on aggressive growth.",
                            outcome: "⚠ " + suggestion
                        });
                        if (finance.revision_request) {
                            this.memory.addRevisionRequest("FinanceAgent", finance.revision_request.target_agent, finance.revision_request.issue + " Suggestion: " + finance.revision_request.suggestion);
                        }
                        emit('timeline_event', { agent: 'Finance Agent', action: 'Budget Rejected - Revisions Requested', status: 'revised' });
                        revisions++;
                    }
                }
            } else {
                // Fallback: Run individual agents linearly
                if (hasAgent('strategy')) {
                    const strategy = await runAgent('strategy', 'Strategy Agent', 'Defining Business Strategy');
                    if (strategy) {
                        this.memory.saveArtifact("StrategyAgent", "strategy", strategy.strategy);
                        emit('artifact_update', { id: 'concept', title: 'Business Strategy', content: JSON.stringify(strategy.strategy, null, 2), version: 1, isOpen: true });
                    }
                }
                if (hasAgent('ops')) {
                    const ops = await runAgent('ops', 'Operations Agent', 'Planning Operations');
                    if (ops) {
                        this.memory.saveArtifact("OperationsAgent", "operations", ops.operations);
                        emit('artifact_update', { id: 'ops', title: 'Operations Plan', content: JSON.stringify(ops.operations, null, 2), version: 1, isOpen: true });
                    }
                }
                if (hasAgent('finance')) {
                    const finance = await runAgent('finance', 'Finance Agent', 'Validating Financial Viability');
                    if (finance) {
                        this.memory.saveArtifact("FinanceAgent", "financials", finance.financials);
                        emit('artifact_update', { id: 'finance', title: 'Financial Model', content: JSON.stringify(finance.financials, null, 2), version: 1, isOpen: true });
                    }
                }
            }

            // 4. Execution Phase
            const promises = [];
            if (hasAgent('design')) promises.push(this.agents.design.run(getSanitizedState()));
            if (hasAgent('marketing')) promises.push(this.agents.marketing.run(getSanitizedState()));
            if (hasAgent('tech')) promises.push(this.agents.tech.run(getSanitizedState()));

            // RENOVATION TRIGGER (Re-enabled with safe image check)
            // Use fullState for renovation as it needs images
            const fullState = this.memory.getSnapshot();
            if (fullState.images && fullState.images.length > 0) {
                console.log("🛠 Triggering Renovation Agent...");
                promises.push(this.agents.renovation.run(fullState));
            }

            // Wait for downstream agents
            if (promises.length > 0) {
                console.log("\n🚀 Executing downstream agents...");
                if (hasAgent('design')) emit('timeline_event', { agent: 'Design Agent', action: 'Designing Brand Identity', status: 'pending' });
                if (hasAgent('marketing')) emit('timeline_event', { agent: 'Marketing Agent', action: 'Planning Launch', status: 'pending' });
                if (hasAgent('tech')) emit('timeline_event', { agent: 'Tech Agent', action: 'Generating Tech Stack', status: 'pending' });
                // if (fullState.images) ... (Renovation log disabled)

                const results = await Promise.all(promises);
                let finalPreviewUrl = null;

                results.forEach(res => {
                    if (res && res.design) {
                        this.memory.saveArtifact("DesignAgent", "design", res.design);
                        emit('artifact_update', { id: 'design', title: 'Brand Identity', content: JSON.stringify(res.design, null, 2), version: 1, isOpen: true });
                        emit('timeline_event', { agent: 'Design Agent', action: 'Brand Identity Created', status: 'accepted' });
                    }
                    if (res && res.marketing) {
                        this.memory.saveArtifact("MarketingAgent", "marketing", res.marketing);
                        emit('artifact_update', { id: 'marketing', title: 'Go-To-Market Plan', content: JSON.stringify(res.marketing, null, 2), version: 1, isOpen: true });
                        emit('timeline_event', { agent: 'Marketing Agent', action: 'Launch Plan Ready', status: 'accepted' });
                    }
                    if (res && res.tech) {
                        const techData = res.tech;
                        this.memory.saveArtifact("TechAgent", "tech", techData);
                        emit('artifact_update', { id: 'tech', title: 'Technical Architecture', content: JSON.stringify(techData, null, 2), version: 1, isOpen: true });
                        emit('timeline_event', { agent: 'Tech Agent', action: 'Tech Stack Defined', status: 'accepted' });

                        try {
                            const state = this.memory.getSnapshot();
                            const projectName = state.business_profile?.name || "Founding AI Project";
                            const previewUrl = this.generateLocalSite(techData, projectName);
                            if (previewUrl) {
                                techData.preview_url = previewUrl;
                                finalPreviewUrl = previewUrl;
                                emit('artifact_update', { id: 'tech', title: 'Technical Architecture', content: JSON.stringify(techData, null, 2), version: 2, isOpen: true });
                                emit('timeline_event', { agent: 'System', action: 'Website Live at ' + previewUrl, status: 'accepted' });
                            }
                        } catch (e) { console.error("Site Gen Error", e); }
                    }
                    if (res && res.renovation_plan) {
                        this.memory.saveArtifact("RenovationAgent", "renovation", res.renovation_plan);
                        emit('artifact_update', { id: 'renovation', title: 'Renovation & Visual Upgrade', content: JSON.stringify(res.renovation_plan, null, 2), version: 1, isOpen: true });
                        emit('timeline_event', { agent: 'Renovation Agent', action: 'Visual Upgrade Planned', status: 'accepted' });
                    }
                });

                if (finalPreviewUrl) {
                    let finalBlueprint = { message: "Task Complete", artifacts: this.memory.artifacts };
                    emit('completion', { blueprint: finalBlueprint, previewUrl: finalPreviewUrl });
                    console.log("\n✨ Simulation Complete.");
                    return this.memory.getSnapshot();
                }
            }

            // 5. Synthesis
            let finalBlueprint = { message: "Task Complete", artifacts: this.memory.artifacts };
            if (activeAgents.includes('synthesis') || activeAgents.length > 3) {
                emit('timeline_event', { agent: 'Synthesis Agent', action: 'Assembling Final Blueprint', status: 'pending' });
                const synthesisResult = await this.agents.synthesis.run(getSanitizedState());
                this.memory.saveArtifact("SynthesisAgent", "blueprint", synthesisResult.final_blueprint);
                finalBlueprint = synthesisResult.final_blueprint;
            }

            emit('completion', { blueprint: finalBlueprint });
            console.log("\n✨ Simulation Complete.");
            return this.memory.getSnapshot();

        } catch (error) {
            console.error("FATAL ORCHESTRATOR ERROR:", error);
            emit('timeline_event', { agent: 'System', action: 'Critical Error: ' + error.message, status: 'rejected' });
            emit('completion', { blueprint: { error: error.message }, error: true });
            return null;
        }
    }

    generateLocalSite(techArtifact, projectName) {
        // In serverless/Vercel environment, we cannot write to disk reliably.
        // We will return null for preview_url and rely on Frontend to render file_structure.
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
            console.log("Skipping local site generation in production environment.");
            return null;
        }

        try {
            const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now();
            const projectDir = path.join(this.publicDir, sanitizedName);

            if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
            }

            let htmlContent = "<h1>Generated Site</h1><p>Site was generated but content was missing.</p>";
            let cssContent = "body { font-family: sans-serif; }";

            if (techArtifact.file_structure) {
                const root = techArtifact.file_structure;

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

                const index = findFile(root, 'index.html');
                if (index) htmlContent = index;

                const style = findFile(root, 'styles.css') || findFile(root, 'style.css') || findFile(root, 'App.css');
                if (style) cssContent = style;
            }

            fs.writeFileSync(path.join(projectDir, 'index.html'), htmlContent);
            fs.writeFileSync(path.join(projectDir, 'styles.css'), cssContent);

            return `http://localhost:3000/sites/${sanitizedName}/index.html`;

        } catch (e) {
            console.error("Failed to generate local site:", e);
            return null;
        }
    }
}
