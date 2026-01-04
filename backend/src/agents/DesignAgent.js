import { Agent } from '../core/Agent.js';

export class DesignAgent extends Agent {
    constructor() {
        super(
            "Design Agent",
            `ROLE: Design Agent

GOAL:
Create the brand identity and a unique SVG logo.

RESPONSIBILITIES:
- Brand personality
- Visual direction
- Asset descriptions (colors, layout)
- GENERATE A MINIMALIST SVG LOGO (valid XML string starting with <svg>)

CONSTRAINTS:
- Must align with approved strategy.
- Logo must be simple, geometric, and professional.
- SVG must be self-contained (no external references).

RULES:
- No implementation details.
- No business logic.`,
            {
                type: "object",
                properties: {
                    design: {
                        type: "object",
                        properties: {
                            brand_personality: { type: "string" },
                            color_palette: { type: "array", items: { type: "string" } },
                            visual_assets: { type: "array", items: { type: "string" } },
                            logo_svg: { type: "string", description: "Raw SVG code for the logo" }
                        }
                    }
                }
            }
        );
    }

    initialize(apiKey) {
        // User requested "nano banana pro".
        // We will try to use it, but generic Agent uses gemini-flash-latest.
        // We override here.
        super.initialize(apiKey);

        // Overwrite the model with the requested one
        // Note: If "nano-banana-pro" doesn't exist, this might fail at generate time.
        // We'll trust the user has access.
        this.model = this.genAI.getGenerativeModel({
            // User requested "3 pro". Using available preview model.
            model: "gemini-3-pro-preview",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
    }
}
