import { Agent } from '../core/Agent.js';

export class DailyPlannerAgent extends Agent {
    constructor() {
        super(
            "Daily Planner Agent",
            `ROLE: Daily Planner & Chief of Staff
            
GOAL: Analyze the current Business State and generate a prioritized list of tasks for the CEO (User) for TODAY.

INPUT:
- Business Metrics (Revenue, Users, etc.)
- Active Issues
- Recent Decisions
- Calendar/Time Context

OUTPUT:
- A structured "Daily Briefing" containing:
  1. Key Metrics Snapshot (Health check)
  2. TOP 3 Priorities for Today (Must do)
  3. Pending Decisions (Requires unblocking)
  4. Suggested Delegations (What to assign to other agents)

CONSTRAINTS:
- Keep it concise and actionable.
- Focus on high-impact items.`,
            {
                type: "object",
                properties: {
                    daily_briefing: {
                        type: "object",
                        properties: {
                            metrics_snapshot: { type: "string" },
                            top_priorities: {
                                type: "array",
                                items: { type: "object", properties: { task: { type: "string" }, urgency: { type: "string" } } }
                            },
                            pending_decisions: { type: "array", items: { type: "string" } },
                            delegations: { type: "array", items: { type: "string" } }
                        }
                    }
                }
            }
        );
    }
}

export class OpsIntelligenceAgent extends Agent {
    constructor() {
        super(
            "Ops Intelligence Agent",
            `ROLE: Operational Intelligence Director

GOAL: Monitor business execution, flag bottlenecks, and suggest process improvements.

INPUT:
- Operational Metrics (Server load, support tickets, delivery times)
- Team status

OUTPUT:
- "Ops Report" detailing:
  1. System Health Status (Green/Yellow/Red)
  2. Critical Bottlenecks identified
  3. Optimization Recommendations`,
            {
                type: "object",
                properties: {
                    ops_report: {
                        type: "object",
                        properties: {
                            system_health: { type: "string", enum: ["Green", "Yellow", "Red"] },
                            bottlenecks: { type: "array", items: { type: "string" } },
                            recommendations: { type: "array", items: { type: "string" } }
                        }
                    }
                }
            }
        );
    }
}

export class FinanceIntelligenceAgent extends Agent {
    constructor() {
        super(
            "Finance Intelligence Agent",
            `ROLE: CFO & Risk Controller

GOAL: Safeguard financial health, monitor runway, and VETO unsafe spending.

INPUT:
- Proposed Decisions/Budgets
- Current Cash Balance & Burn Rate

OUTPUT:
- "Financial Review":
  1. Approval Status (APPROVED / REJECTED / WARNING)
  2. Financial Impact Analysis
  3. Runway Projection
  4. Risk Assessment`,
            {
                type: "object",
                properties: {
                    financial_review: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["APPROVED", "REJECTED", "WARNING"] },
                            impact_analysis: { type: "string" },
                            runway_projection: { type: "string" },
                            risk_assessment: { type: "string" }
                        }
                    }
                }
            }
        );
    }
}

export class DecisionAdvisorAgent extends Agent {
    constructor() {
        super(
            "Decision Advisor Agent",
            `ROLE: Strategic Decision Advisor

GOAL: Synthesize conflicting inputs (e.g., Ops wanting speed vs Finance wanting savings) and recommend the best path forward.

INPUT:
- The specific Dilemma/Question
- Arguments from Ops Agent
- Arguments from Finance Agent

OUTPUT:
- "Decision Memo":
  1. Recommendation (Clear choice)
  2. Trade-off Analysis (Why this choice?)
  3. Next Steps`,
            {
                type: "object",
                properties: {
                    decision_memo: {
                        type: "object",
                        properties: {
                            recommendation: { type: "string" },
                            trade_offs: { type: "string" },
                            next_steps: { type: "array", items: { type: "string" } }
                        }
                    }
                }
            }
        );
    }
}
