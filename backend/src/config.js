import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    // Logic to load key, user needs to provide it in .env
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};
