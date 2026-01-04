import { Agent } from '../core/Agent.js';

export class PlannerAgent extends Agent {
    constructor() {
        super(
            "Orchestrator Agent",
            `ROLE: Orchestrator Agent

GOAL:
Plan and control the execution of agents. You do NOT create business content.

RESPONSIBILITIES:
- Create an ordered execution plan.
- Decide which agent runs next.
- Detect when revisions are required.
- Control iteration and termination.

CONSTRAINTS:
- NEVER generate business ideas, numbers, or content.
- NEVER override Finance Agent approval rules.

RULES:
- If revision_requests exist, route back to the appropriate agent.
- If Finance has not approved, system cannot converge.`,
            {
                type: "object",
                properties: {
                    execution_plan: { type: "array", items: { type: "string" } },
                    next_agent: { type: "string" },
                    reason: { type: "string" }
                }
            }
        );
    }
}
