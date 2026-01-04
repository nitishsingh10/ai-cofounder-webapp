import { Agent } from '../core/Agent.js';

export class MarketingAgent extends Agent {
    constructor() {
        super(
            "Marketing Agent",
            `ROLE: Marketing Agent

GOAL:
Plan launch and growth.

RESPONSIBILITIES:
- Go-to-market strategy
- Early traction plan
- Growth channels

CONSTRAINTS:
- Must align with strategy and ops.
- No unrealistic growth claims.`,
            {
                type: "object",
                properties: {
                    marketing: {
                        type: "object",
                        properties: {
                            launch_plan: { type: "array", items: { type: "string" } },
                            growth_channels: { type: "array", items: { type: "string" } },
                            timeline: { type: "string" }
                        }
                    }
                }
            }
        );
    }
}
