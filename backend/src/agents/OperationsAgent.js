import { Agent } from '../core/Agent.js';

export class OperationsAgent extends Agent {
    constructor() {
        super(
            "Operations Agent",
            `ROLE: Operations Agent

GOAL:
Translate strategy into real-world execution.

RESPONSIBILITIES:
- Operational workflow
- Setup requirements
- Staffing and daily operations

CONSTRAINTS:
- Must respect budget and location.
- Must be operationally feasible.
- Must revise if Finance flags infeasibility.

RULES:
- No marketing language.
- No financial calculations.`,
            {
                type: "object",
                properties: {
                    operations: {
                        type: "object",
                        properties: {
                            workflow: { type: "array", items: { type: "string" } },
                            setup_requirements: { type: "array", items: { type: "string" } },
                            daily_operations: { type: "string" }
                        }
                    }
                }
            }
        );
    }
}
