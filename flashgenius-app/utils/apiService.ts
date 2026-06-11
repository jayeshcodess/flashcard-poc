export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface GenerationResult {
  cards: Flashcard[];
  topic: string;
}

/**
 * Generates flashcards from study notes.
 * Uses Gemini API if NEXT_PUBLIC_GEMINI_API_KEY is set, otherwise falls back to mock generation.
 */
export async function generateFlashcards(
  text: string
): Promise<GenerationResult> {
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

  if (geminiApiKey && geminiApiKey.trim().length > 0) {
    return generateWithGemini(text, geminiApiKey);
  }

  return mockGenerateFlashcards(text);
}

async function generateWithGemini(
  text: string,
  apiKey: string
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a study flashcard generator. Given the user's study notes:
1. Generate exactly 5 flashcards.
2. Generate a short, 2-3 word topic summary that represents these notes to use as the deck title.

Return the response as a JSON object containing a "topic" string and a "cards" array. Each flashcard in the array must have:
- "id": a unique string identifier (e.g. "card-1", "card-2", etc.)
- "question": a clear, concise study question derived from the notes
- "answer": a factual, complete answer to the question

Here are the user's study notes:
${text}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                topic: { type: "STRING" },
                cards: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      id: { type: "STRING" },
                      question: { type: "STRING" },
                      answer: { type: "STRING" }
                    },
                    required: ["id", "question", "answer"]
                  }
                }
              },
              required: ["topic", "cards"]
            }
          }
        }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 400 && errorBody.includes("API_KEY_INVALID")) {
        throw new Error("Invalid Gemini API key. Please check your key in .env.local.");
      }
      if (response.status === 429) {
        throw new Error("Gemini API rate limit exceeded. Please wait a moment and try again.");
      }
      throw new Error(
        `Gemini API error (${response.status}): ${errorBody.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Empty response from Gemini. Please retry.");
    }

    let parsed: GenerationResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("We couldn't extract enough meaningful content from your notes.");
    }

    if (!parsed.topic || !Array.isArray(parsed.cards) || parsed.cards.length !== 5) {
      throw new Error(
        "Invalid response format: expected a topic and exactly 5 flashcards."
      );
    }

    for (const card of parsed.cards) {
      if (!card.id || !card.question || !card.answer) {
        throw new Error(
          "Invalid card structure: each card must have id, question, and answer."
        );
      }
    }

    return parsed;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        "Request timed out after 30 seconds. Please check your connection and retry."
      );
    }
    throw err;
  }
}

function mockGenerateFlashcards(text: string): GenerationResult {
  const sentences = text
    .replace(/([.?!])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 15)
    .sort((a, b) => b.length - a.length)
    .slice(0, 5);

  while (sentences.length < 5) {
    sentences.push(
      `This is a placeholder sentence derived from the provided study text (${sentences.length + 1}).`
    );
  }

  const cards = sentences.map((sentence, i) => ({
    id: `mock-${i + 1}`,
    question: `What does the following statement describe? "${sentence.slice(0, 80)}${sentence.length > 80 ? "…" : ""}"`,
    answer: sentence,
  }));

  // Create a mock topic based on the first few words of the text
  const cleanWords = text.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const topic = cleanWords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "Mock Study Topic";

  return {
    cards,
    topic: topic.length > 25 ? topic.slice(0, 25) + "..." : topic
  };
}
