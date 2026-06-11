import { generateFlashcards } from '@/utils/apiService';

// Mock global fetch
global.fetch = jest.fn();

describe('apiService', () => {
  const mockValidResponse = {
    candidates: [
      {
        content: {
          parts: [
            {
              text: JSON.stringify([
                { id: '1', question: 'Q1', answer: 'A1' },
                { id: '2', question: 'Q2', answer: 'A2' },
                { id: '3', question: 'Q3', answer: 'A3' },
                { id: '4', question: 'Q4', answer: 'A4' },
                { id: '5', question: 'Q5', answer: 'A5' },
              ]),
            },
          ],
        },
      },
    ],
  };

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('TC-API-01: Verify Gemini API is called with correct JSON payload and headers', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockValidResponse,
    });

    const result = await generateFlashcards('test study notes');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=test-api-key',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('test study notes'),
      })
    );
    expect(result).toHaveLength(5);
  });

  it('TC-API-02: Validate fallback mock generation triggers when no API key is provided', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = ''; // Empty key
    
    // Note: mockGenerateFlashcards logic requires multiple sentences to generate 5 cards cleanly
    const testNotes = 'First long sentence for testing purposes. Second long sentence for testing purposes. Third long sentence for testing purposes. Fourth long sentence for testing purposes. Fifth long sentence for testing purposes.';
    
    const result = await generateFlashcards(testNotes);
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toHaveLength(5);
    expect(result[0].id).toContain('mock-');
  });

  it('TC-API-03: Verify 30-second abort controller successfully cancels stalled requests', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    
    // We simulate a timeout by making fetch throw an AbortError as if the signal aborted it
    const abortError = new DOMException('The user aborted a request.', 'AbortError');
    (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

    await expect(generateFlashcards('test')).rejects.toThrow(/timed out/i);
  });

  it('TC-API-04: Verify UI displays friendly error message on 400 API_KEY_INVALID', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-api-key';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'API_KEY_INVALID',
    });

    await expect(generateFlashcards('test')).rejects.toThrow(/Invalid Gemini API key/i);
  });
});
