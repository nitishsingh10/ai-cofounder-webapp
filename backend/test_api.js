import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log("Testing Gemini API...");
    const key = process.env.GEMINI_API_KEY;

    // List of models to try
    const models = [
        "gemini-flash-latest",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash-exp"
    ];

    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Ping. Reply 'Pong'.");
            const response = await result.response;
            console.log(`✅ SUCCESS with ${modelName}! Response: ${response.text()}`);
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ Failed ${modelName}: ${error.message.split('[')[0]}`); // Log brief error
        }
    }
    console.log("\n❌ ALL MODELS FAILED. Check API Key or Region.");
}

test();
