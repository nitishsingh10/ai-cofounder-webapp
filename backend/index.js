import { Orchestrator } from './src/core/Orchestrator.js';
import { CONFIG } from './src/config.js';

const SAMPLE_COMMAND = "Open a high-end bakery in Bellandur, Bangalore with a budget of ₹15 Lakhs. I want to launch in 3 months.";

async function main() {
    if (!CONFIG.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }

    const orchestrator = new Orchestrator(CONFIG.GEMINI_API_KEY);

    try {
        const finalState = await orchestrator.run(SAMPLE_COMMAND);

        if (finalState.status === "clarification_needed") {
            console.log("\n⚠️ Stopped for Clarification:", finalState.question);
            return;
        }

        // Output result to a file or log
        console.log("\n--- FINAL STATE SUMMARY ---");
        if (finalState.agent_outputs.SynthesisAgent) {
            console.log(JSON.stringify(finalState.agent_outputs.SynthesisAgent, null, 2));
        } else {
            console.log("No final blueprint generated due to Finance rejection (Max revisions reached).");
            console.log("Last Finance Decision:", finalState.financial_checks[finalState.financial_checks.length - 1]);
        }

    } catch (error) {
        console.error("Simulation Failed:", error);
    }
}

main();
