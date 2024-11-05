import { createClient } from 'redis';

// Create a Redis client instance with optional URL
const client = createClient({
    url: 'redis://localhost:6379'  // Replace with your Redis URL if needed
});

// Event listeners
client.on("connect", () => {
    console.log("Client connected to Redis");
});

client.on("ready", () => {
    console.log("Client connected to Redis and ready to use");
});

client.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});

client.on("end", () => {
    console.log("Client disconnected from Redis");
});

(async () => {
    await client.connect();
})();
// Graceful shutdown on process exit
process.on("SIGINT", async () => {
    console.log("Disconnecting Redis client...");
    await client.quit();
    process.exit(0);
});

export default client;
