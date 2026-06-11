interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

/**
 * Generates flashcards from study notes.
 * Uses Gemini API if NEXT_PUBLIC_GEMINI_API_KEY is set, otherwise falls back to mock generation.
 */
export async function generateFlashcards(
  text: string
): Promise<Flashcard[]> {
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

  if (geminiApiKey && geminiApiKey.trim().length > 0) {
    return generateWithGemini(text, geminiApiKey);
  }

  return mockGenerateFlashcards(text);
}

async function generateWithGemini(
  text: string,
  apiKey: string
): Promise<Flashcard[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

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
                  text: `You are a study flashcard generator. Given the user's study notes, generate exactly 5 flashcards as a JSON array. Each flashcard must have:
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

    const parsed: Flashcard[] = JSON.parse(content);

    if (!Array.isArray(parsed) || parsed.length !== 5) {
      throw new Error(
        "Invalid response format: expected exactly 5 flashcards."
      );
    }

    for (const card of parsed) {
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


function mockGenerateFlashcards(text: string): Flashcard[] {
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

  return sentences.map((sentence, i) => ({
    id: `mock-${i + 1}`,
    question: `What does the following statement describe? "${sentence.slice(0, 80)}${sentence.length > 80 ? "…" : ""}"`,
    answer: sentence,
  }));
}
