import { Agent } from '../core/Agent.js';

export class IntentAnalyzer extends Agent {
    constructor() {
        super(
            "Intent Analyzer Agent",
            `ROLE: Intent Analyzer Agent

GOAL:
Analyze the user command to determine the operation mode and required agents.

RESPONSIBILITIES:
- Determine if the user wants to LAUNCH a new business or OPERATE an existing one.
- Select the MINIMUM set of agents required to answer the query.
- Use 'LAUNCH' mode if the user wants to start a new business or build a blueprint.
- Use 'OPERATE' mode for specific questions, updates, or daily planning.

AGENT SELECTION RULES:
- "Revenue", "Profit", "Cost", "Budget" (Launch context) -> ['finance']
- "Revenue", "Runway", "Cash" (Operate context) -> ['finance_intel']
- "Marketing", "Ads", "Growth" -> ['marketing']
- "Tech stack", "Code", "Website" -> ['tech']
- "Plan my day", "Priorities", "Briefing" -> ['daily_planner']
- "System health", "Status", "Bottlenecks" -> ['ops_intel']
- "Make a decision", "Choice", "Option A vs B" -> ['decision_advisor']
- "New Business", "Full Plan", "Idea" -> ['planner', 'strategy', 'ops', 'finance', 'design', 'marketing', 'tech', 'synthesis'] (ALL)

CONSTRAINTS:
- Do NOT run unnecessary agents.
- If missing critical data, ask clarification.`,
            {
                type: "object",
                properties: {
                    mode: { type: "string", enum: ["LAUNCH", "OPERATE"] },
                    required_agents: { type: "array", items: { type: "string" } },
                    constraints: {
                        type: "object",
                        properties: {
                            business_type: { type: "string" },
                            location: { type: "string" },
                            budget: { type: "string" },
                            timeline: { type: "string" }
                        }
                    },
                    missing_fields: { type: "array", items: { type: "string" } },
                    clarification_question: { type: "string", nullable: true }
                }
            }
        );
    }
}
