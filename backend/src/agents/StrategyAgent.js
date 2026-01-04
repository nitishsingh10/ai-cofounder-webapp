import { Agent } from '../core/Agent.js';

export class StrategyAgent extends Agent {
    constructor() {
        super(
            "Strategy Agent",
            `ROLE: Strategy Agent

GOAL:
Define the core business strategy.

RESPONSIBILITIES:
- Business concept
- Target customer
- Value proposition
- Product or service list

CONSTRAINTS:
- Must obey constraints in shared_state.
- Must revise output if Finance or Orchestrator requests.
- Must NOT discuss costs or numbers.

RULES:
- Do NOT invent new constraints.
- Keep strategy realistic and executable.`,
            {
                type: "object",
                properties: {
                    strategy: {
                        type: "object",
                        properties: {
                            concept: { type: "string" },
                            target_customer: { type: "string" },
                            value_proposition: { type: "string" },
                            offerings: { type: "array", items: { type: "string" } }
                        }
                    },
                    assumptions: { type: "array", items: { type: "string" } }
                }
            }
        );
    }
}
