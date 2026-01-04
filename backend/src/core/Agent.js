import { GoogleGenerativeAI } from "@google/generative-ai";

export class Agent {
    constructor(name, roleDefinition, outputSchema) {
        this.name = name;
        this.roleDefinition = roleDefinition;
        this.outputSchema = outputSchema;

        // We will initialize the model lazily or pass the API key
        this.genAI = null;
        this.model = null;
    }

    initialize(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
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

        const prompt = this._buildPrompt(sharedState);
        const MAX_RETRIES = 3;
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            try {
                console.log(`[${this.name}] Thinking...`);
                // Add a small randomized delay to prevent thundering herd
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));

                console.log(`[${this.name}] Generating content...`);
                const result = await this.model.generateContent(prompt);
                console.log(`[${this.name}] Raw response received.`);
                const response = await result.response;
                const text = response.text();
                console.log(`[${this.name}] Text extracted:`, text.substring(0, 50) + "...");

                // Clean markdown code blocks if present
                let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

                // If text starts with "Based on" or other chatty preamble, try to find the first '{'
                const firstBrace = cleanText.indexOf('{');
                const lastBrace = cleanText.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
                }

                // Aggressively fix common LLM JSON errors (unescaped newlines inside strings)
                let parsed;
                try {
                    parsed = JSON.parse(cleanText);

                    // Handle double-encoded JSON (if model returns a string that is actually JSON)
                    if (typeof parsed === 'string') {
                        try {
                            const doubleParsed = JSON.parse(parsed);
                            if (typeof doubleParsed === 'object' && doubleParsed !== null) {
                                console.log(`[${this.name}] Detected double-encoded JSON, fixed.`);
                                parsed = doubleParsed;
                            }
                        } catch (ignore) {
                            // If second parse fails, it was just a regular string
                        }
                    }
                } catch (e) {
                    console.log(`[${this.name}] JSON Parse Error: ${e.message}. Attempting simple fix...`);
                    // Retry or throw
                    throw e;
                }

                console.log(`[${this.name}] Finished.`);
                return parsed;

            } catch (error) {
                console.error(`[${this.name}] Error (Attempt ${attempt + 1}/${MAX_RETRIES}):`, error.message);

                if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
                    attempt++;
                    const delay = Math.pow(2, attempt) * 2000; // Exponential backoff: 4s, 8s, 16s
                    console.log(`[${this.name}] Rate limited. Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
        throw new Error(`[${this.name}] Failed after ${MAX_RETRIES} retries due to rate limits.`);
    }

    _buildPrompt(state) {
        return `
      ROLE: ${this.name}
      DESCRIPTION: ${this.roleDefinition}

      CURRENT STATE:
      ${JSON.stringify(state, null, 2)}

      TASK:
      Analyze the current state and produce the required output strictly in JSON format.
      
      OUTPUT SCHEMA:
      ${JSON.stringify(this.outputSchema, null, 2)}
    `;
    }
}
