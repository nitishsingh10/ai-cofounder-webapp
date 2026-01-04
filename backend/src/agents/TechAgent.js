import { Agent } from '../core/Agent.js';

export class TechAgent extends Agent {
    constructor() {
        super(
            "Tech Agent",
            `ROLE: Tech Agent

GOAL:
Convert the approved business plan into a deployable website.

RESPONSIBILITIES:
- Generate website structure
- Provide code artifacts
- Prepare deployable package

CONSTRAINTS:
- Must reflect approved branding and offerings.
- No backend infra assumptions.`,
            {
                type: "object",
                properties: {
                    tech: {
                        type: "object",
                        properties: {
                            stack: { type: "array", items: { type: "string" } },
                            file_structure: { type: "object" },
                            deployment_instructions: { type: "string" },
                            zip_ready: { type: "boolean" },
                            generated_prompt: { type: "string", description: "A highly detailed, context-aware prompt for an AI coding agent to build this entire system." }
                        }
                    }
                }
            }
        );
    }
}
