export class Memory {
    constructor() {
        this.state = {
            user_intent: "",
            constraints: {},
            execution_plan: [],
            agent_outputs: {},
            revision_requests: [],
            financial_checks: [],
            images: [], // Attached images for analysis
            status: "initialized" // initialized, planning, executing, revising, completed
        };
    }

    // Initialize with user command
    init(command) {
        this.state.user_intent = command;
        this.state.status = "planning";
    }

    // Update extracted constraints
    updateConstraints(constraints) {
        this.state.constraints = { ...this.state.constraints, ...constraints };
    }

    // Set the execution plan
    setPlan(plan) {
        this.state.execution_plan = plan;
    }

    // Set images for analysis
    setImages(images) {
        this.state.images = images;
    }

    // Save agent output
    saveArtifact(agentName, artifactKey, data) {
        if (!this.state.agent_outputs[agentName]) {
            this.state.agent_outputs[agentName] = {};
        }
        this.state.agent_outputs[agentName][artifactKey] = data;
        console.log(`[Memory] Artifact saved for ${agentName}: ${artifactKey}`);
    }

    // Log a revision request (failure/critique)
    addRevisionRequest(fromAgent, toAgent, reason) {
        this.state.revision_requests.push({
            timestamp: Date.now(),
            from: fromAgent,
            to: toAgent,
            reason: reason,
            resolved: false
        });
        this.state.status = "revising";
        console.log(`[Memory] Revision requested by ${fromAgent} for ${toAgent}: ${reason}`);
    }

    // Log financial check
    logFinancialCheck(decision, reason) {
        this.state.financial_checks.push({
            timestamp: Date.now(),
            decision: decision, // PASS or FAIL
            reason: reason
        });
    }

    // Get full state snapshot
    getSnapshot() {
        return JSON.parse(JSON.stringify(this.state));
    }

    // Get specific output
    getArtifact(agentName, artifactKey) {
        return this.state.agent_outputs[agentName]?.[artifactKey] || null;
    }
}
