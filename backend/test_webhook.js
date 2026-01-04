const webhookUrl = "https://hook.eu1.make.com/vkd9dmu9k65q44qvcfn4ctkwobk4o96k";

const mockData = {
    business_name: "Mock Bakery AI",
    architecture: {
        stack: ["React", "Node.js", "MongoDB"],
        file_structure: {
            "src": {
                "App.js": "...",
                "components": {}
            }
        },
        deployment_instructions: "Run npm install && npm start",
        zip_ready: true,
        generated_prompt: "You are an expert AI coder. Build a bakery website with a pink theme, allowing users to order custom cakes. Use React and Tailwind CSS."
    },
    prompt: "You are an expert AI coder. Build a bakery website with a pink theme, allowing users to order custom cakes. Use React and Tailwind CSS."
};

console.log("Sending mock data to:", webhookUrl);

fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockData)
})
    .then(async res => {
        console.log(`Status Code: ${res.status}`);
        const text = await res.text();
        console.log(`Response: ${text}`);
    })
    .catch(err => {
        console.error("Error sending webhook:", err);
    });
