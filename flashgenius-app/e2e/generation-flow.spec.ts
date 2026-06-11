import { test, expect } from '@playwright/test';

test.describe('Generation Flow and Deck Review', () => {

  test.beforeEach(async ({ page }) => {
    // Intercept Gemini API to prevent real credits usage and ensure deterministic behavior
    await page.route('**/models/gemini-*-flash:generateContent*', async route => {
      const json = {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify([
                { id: '1', question: 'Question 1', answer: 'Answer 1' },
                { id: '2', question: 'Question 2', answer: 'Answer 2' },
                { id: '3', question: 'Question 3', answer: 'Answer 3' },
                { id: '4', question: 'Question 4', answer: 'Answer 4' },
                { id: '5', question: 'Question 5', answer: 'Answer 5' }
              ])
            }]
          }
        }]
      };
      await route.fulfill({ json });
    });

    // Make sure we clear local storage before starting
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-UI-01, TC-UI-02, TC-UI-03, TC-UI-04: Full deck review lifecycle', async ({ page }) => {
    // 1. Paste text
    const textarea = page.getByPlaceholder(/Paste your notes here/i);
    await textarea.fill('a'.repeat(60)); // Ensure it's >= 50 chars

    // Set a dummy API key using evaluate to bypass the UI input which was removed,
    // wait, we can't set NEXT_PUBLIC_GEMINI_API_KEY at runtime easily via Playwright.
    // However, our app will just fall back to mock generation if the env var isn't set,
    // OR if it is set during build, it will hit our mock route. Both are fine!
    
    // Generate
    await page.getByRole('button', { name: /generate flashcards/i }).click();

    // 2. Verify 5 cards are rendered (we check if Card 1 of 5 is visible)
    await expect(page.getByText('Card 1 of 5')).toBeVisible();
    await expect(page.getByText('Question 1')).toBeVisible();
    
    // TC-UI-04: 'Previous' button is disabled on Card 1
    const prevBtn = page.getByRole('button', { name: /← Previous/i });
    await expect(prevBtn).toBeDisabled();

    // 3. TC-UI-02: Clicking a card triggers isFlipped
    const flipContainer = page.locator('.flip-container');
    await flipContainer.click();
    
    // The flip-inner should have the 'flipped' class
    await expect(page.locator('.flip-inner')).toHaveClass(/flipped/);
    await expect(page.getByText('Answer 1')).toBeVisible();

    // 4. TC-UI-03: 'Next' button increments index and resets isFlipped
    const nextBtn = page.getByRole('button', { name: /Next →/i });
    await nextBtn.click();
    
    await expect(page.getByText('Card 2 of 5')).toBeVisible();
    await expect(page.locator('.flip-inner')).not.toHaveClass(/flipped/);
    await expect(page.getByText('Question 2')).toBeVisible();
    
    // Navigate to end
    await nextBtn.click(); // Card 3
    await nextBtn.click(); // Card 4
    await nextBtn.click(); // Card 5
    
    await expect(page.getByText('Card 5 of 5')).toBeVisible();
    
    // TC-UI-04: 'Next' button disabled on Card 5
    await expect(nextBtn).toBeDisabled();
  });
});
