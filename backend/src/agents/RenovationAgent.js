import { Agent } from '../core/Agent.js';

export class RenovationAgent extends Agent {
    constructor() {
        super(
            "Renovation Agent",
            `ROLE: Renovation Agent (Architect & Interior Designer)

GOAL:
Analyze shop photos and propose a visual renovation plan with cost estimates.

RESPONSIBILITIES:
- Analyze input images for style, layout, and condition.
- Propose specific visual upgrades (lighting, furniture, branding).
- Estimate costs for each upgrade item.
- Generate a text prompt for visualizing the "After" state.

OUTPUT FORMAT:
JSON object with:
- visual_analysis: string (observation of current state)
- renovation_style: string (proposed new style)
- upgrades: array of { item: string, description: string, estimated_cost: string }
- total_estimated_cost: string
- renovation_image_prompt: string (prompt to generate the renovation visual)
`,
            {
                type: "object",
                properties: {
                    renovation_plan: {
                        type: "object",
                        properties: {
                            visual_analysis: { type: "string" },
                            renovation_style: { type: "string" },
                            upgrades: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        item: { type: "string" },
                                        description: { type: "string" },
                                        estimated_cost: { type: "string" }
                                    }
                                }
                            },
                            total_estimated_cost: { type: "string" },
                            renovation_image_prompt: { type: "string" }
                        }
                    }
                }
            }
        );
    }

    initialize(apiKey) {
        super.initialize(apiKey);
        // Use Flash model for reliable vision capabilities
        // Use 3 Pro for advanced vision capabilities
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-3-pro-preview",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
    }

    async run(sharedState) {
        if (!this.model) {
            throw new Error("Agent not initialized with API Key");
        }

        console.log(`[${this.name}] Starting multimodal analysis...`);

        // Check for images in sharedState (injected by Orchestrator)
        const images = sharedState.images || [];

        // Build prompt parts
        const promptParts = [
            this._buildPrompt(sharedState)
        ];

        // Add images to prompt
        // Images are expected to be base64 strings with mime type prefix usually, or just base64 data.
        // Google Gen AI expects: { inlineData: { data: base64String, mimeType: "image/jpeg" } }
        // We assume frontend sends data URI: "data:image/jpeg;base64,....."

        images.forEach((imgDataUri, index) => {
            if (typeof imgDataUri === 'string' && imgDataUri.startsWith('data:')) {
                const matches = imgDataUri.match(/^data:(.+);base64,(.+)$/);
                if (matches) {
                    const mimeType = matches[1];
                    const data = matches[2];
                    promptParts.push({
                        inlineData: {
                            data: data,
                            mimeType: mimeType
                        }
                    });
                    console.log(`[${this.name}] Added image ${index + 1} to prompt.`);
                }
            }
        });

        // Execute
        try {
            console.log(`[${this.name}] Generating content...`);
            const result = await this.model.generateContent(promptParts);
            const response = await result.response;
            const text = response.text();

            // Parse JSON
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);

            console.log(`[${this.name}] Analysis complete.`);
            return parsed;

        } catch (error) {
            console.error(`[${this.name}] Error:`, error);
            throw error;
        }
    }
}
