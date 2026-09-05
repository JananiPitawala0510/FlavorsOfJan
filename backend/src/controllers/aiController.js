const util = require('util');
const { GoogleGenAI, ApiError } = require('@google/genai');
const db = require('../config/db');

const query = util.promisify(db.query).bind(db);

// Reuses only the API key from the environment (never sent to the frontend)
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = 'gemini-3.6-flash';
const MAX_HISTORY_TURNS = 12;

const SYSTEM_PROMPT = `You are FlavorMate, the friendly AI cooking companion built into FlavorsOfJan, a personal recipe journal app.

You help the person with:
- Recommending recipes based on ingredients they say they have on hand — prefer a recipe already in their cookbook (listed below) when it's a good match, and say so by name; suggest an original recipe only when nothing in their cookbook fits.
- Generating simple, easy-to-follow recipes from scratch when asked.
- Answering general cooking questions (techniques, timing, temperatures, food safety, etc).
- Suggesting ingredient substitutions.
- Modifying a recipe on request (e.g. make it vegetarian, halve the servings, remove an allergen, swap an ingredient).

Keep replies warm, concise, and practical — like a knowledgeable friend, not a formal document. Reply in plain text only — no Markdown syntax (no "**", "#", or "*" bullets). When you give a recipe, format it with a short title line, a blank line, then "Ingredients:" followed by one ingredient per line prefixed with "- ", a blank line, then "Steps:" followed by numbered lines ("1. ", "2. ", ...). Don't pad with disclaimers.`;

// Builds a compact, token-cheap summary of the user's own saved recipes so
// FlavorMate can recommend from what they actually already have.
async function buildCookbookContext() {
    const rows = await query(`
        SELECT r.id, r.title, r.servings, i.name AS ingredient_name
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
        ORDER BY r.id
    `);

    const byRecipe = new Map();
    for (const row of rows) {
        if (!byRecipe.has(row.id)) {
            byRecipe.set(row.id, { title: row.title, servings: row.servings, ingredients: [] });
        }
        if (row.ingredient_name) {
            byRecipe.get(row.id).ingredients.push(row.ingredient_name);
        }
    }

    if (byRecipe.size === 0) {
        return 'The cookbook is currently empty — no saved recipes yet.';
    }

    return Array.from(byRecipe.values())
        .map((r, idx) => {
            const servings = r.servings ? `, serves ${r.servings}` : '';
            const ingredients = r.ingredients.length ? r.ingredients.join(', ') : 'no ingredients listed';
            return `${idx + 1}. ${r.title}${servings} — ingredients: ${ingredients}`;
        })
        .join('\n');
}

const isValidTurn = (turn) =>
    turn &&
    (turn.role === 'user' || turn.role === 'assistant') &&
    typeof turn.content === 'string' &&
    turn.content.trim().length > 0;

// Gemini's Content role must be 'user' or 'model' (not 'assistant')
const toGeminiContent = (turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
});

exports.chat = async (req, res) => {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ message: 'A message is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error('FlavorMate is missing GEMINI_API_KEY in backend/.env');
        return res.status(500).json({
            message: 'FlavorMate is not configured yet — add GEMINI_API_KEY to backend/.env and restart the server.',
        });
    }

    try {
        const cookbook = await buildCookbookContext();
        const priorTurns = Array.isArray(history)
            ? history.filter(isValidTurn).slice(-MAX_HISTORY_TURNS)
            : [];

        const chat = genAI.chats.create({
            model: MODEL,
            history: priorTurns.map(toGeminiContent),
            config: {
                systemInstruction: `${SYSTEM_PROMPT}\n\nThe user's current cookbook:\n${cookbook}`,
            },
        });

        const response = await chat.sendMessage({ message: message.trim() });

        if (!response.text) {
            return res.status(502).json({
                message: "FlavorMate couldn't come up with a response to that — try rephrasing?",
            });
        }

        res.json({ reply: response.text });
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 401 || error.status === 403) {
                console.error('FlavorMate auth error — check GEMINI_API_KEY:', error.message);
                return res.status(500).json({
                    message: 'FlavorMate is not configured correctly on the server.',
                });
            }
            if (error.status === 429) {
                return res.status(429).json({
                    message: "FlavorMate is a little busy right now — please try again in a moment.",
                });
            }
            console.error('FlavorMate Gemini API error:', error);
            return res.status(502).json({ message: "FlavorMate couldn't respond right now. Please try again." });
        }
        console.error('FlavorMate unexpected error:', error);
        res.status(500).json({ message: 'Something went wrong talking to FlavorMate.' });
    }
};
