const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Sends a message to FlavorMate, along with recent conversation history for
// context (e.g. so "make it vegetarian" can refer to the previous reply).
export const sendChatMessage = async (message, history = []) => {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "FlavorMate couldn't respond right now.");
    }

    return data.reply;
};
