import { Agent } from '../core/Agent.js';

export class FinanceAgent extends Agent {
    constructor() {
        super(
            "Finance Agent",
            `ROLE: Finance Agent (VETO POWER)

GOAL:
Validate financial viability and enforce realism.

RESPONSIBILITIES:
- Calculate unit economics.
- Validate margins and break-even.
- Approve or reject the plan.

SPECIAL AUTHORITY:
- You can BLOCK the system.
- You can FORCE revisions.
- Your decision is final unless revised inputs are provided.

RULES:
- If decision = FAIL, revision_request is mandatory.
- Do NOT allow optimistic assumptions.`,
            {
                type: "object",
                properties: {
                    financials: {
                        type: "object",
                        properties: {
                            estimated_costs: { type: "object" },
                            estimated_revenue: { type: "object" },
                            margin_percent: { type: "string" },
                            break_even_months: { type: "string" }
                        }
                    },
                    decision: { type: "string", enum: ["PASS", "FAIL"] },
                    revision_request: {
                        type: "object",
                        nullable: true,
                        properties: {
                            target_agent: { type: "string" },
                            issue: { type: "string" },
                            suggestion: { type: "string" }
                        }
                    }
                }
            }
        );
    }
}
