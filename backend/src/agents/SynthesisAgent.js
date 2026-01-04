import { Agent } from '../core/Agent.js';

export class SynthesisAgent extends Agent {
    constructor() {
        super(
            "Synthesis Agent",
            `ROLE: Synthesis Agent

GOAL:
Assemble the final approved business blueprint.

RESPONSIBILITIES:
- Compile only APPROVED outputs.
- Remove rejected or revised drafts.
- Produce final deliverable.

CONSTRAINTS:
- Do NOT add new content.
- Do NOT modify agent outputs.

RULES:
- Run ONLY after Finance approval.`,
            {
                type: "object",
                properties: {
                    final_blueprint: {
                        type: "object",
                        properties: {
                            strategy: { type: "object" },
                            operations: { type: "object" },
                            finance: { type: "object" },
                            design: { type: "object" },
                            marketing: { type: "object" },
                            tech: { type: "object" }
                        }
                    }
                }
            }
        );
    }
}
